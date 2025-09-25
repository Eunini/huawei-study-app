import asyncio
import json
import logging
from typing import Dict, List, Optional, AsyncGenerator
import httpx
from app.config import Settings

logger = logging.getLogger(__name__)

class OllamaService:
    def __init__(self, settings: Settings):
        self.base_url = settings.OLLAMA_BASE_URL
        self.model = settings.OLLAMA_MODEL
        self.timeout = settings.OLLAMA_TIMEOUT
        
    async def health_check(self) -> bool:
        """Check if Ollama server is running and accessible."""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                return response.status_code == 200
        except Exception as e:
            logger.error(f"Ollama health check failed: {e}")
            return False
    
    async def pull_model(self, model_name: Optional[str] = None) -> bool:
        """Pull/download a model from Ollama."""
        model = model_name or self.model
        try:
            async with httpx.AsyncClient(timeout=300.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/pull",
                    json={"name": model}
                )
                return response.status_code == 200
        except Exception as e:
            logger.error(f"Failed to pull model {model}: {e}")
            return False
    
    async def list_models(self) -> List[Dict]:
        """List available models in Ollama."""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                if response.status_code == 200:
                    data = response.json()
                    return data.get("models", [])
                return []
        except Exception as e:
            logger.error(f"Failed to list models: {e}")
            return []
    
    async def generate_response(
        self, 
        prompt: str, 
        model: Optional[str] = None,
        system_prompt: Optional[str] = None,
        context: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048
    ) -> str:
        """Generate a response from Ollama model."""
        model_name = model or self.model
        
        # Construct the full prompt
        full_prompt = ""
        if system_prompt:
            full_prompt += f"System: {system_prompt}\n\n"
        if context:
            full_prompt += f"Context: {context}\n\n"
        full_prompt += f"User: {prompt}\n\nAssistant:"
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                payload = {
                    "model": model_name,
                    "prompt": full_prompt,
                    "stream": False,
                    "options": {
                        "temperature": temperature,
                        "num_predict": max_tokens
                    }
                }
                
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json=payload
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data.get("response", "").strip()
                else:
                    logger.error(f"Ollama API error: {response.status_code} - {response.text}")
                    return "Sorry, I encountered an error processing your request."
                    
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "Sorry, I'm currently unavailable. Please try again later."
    
    async def generate_streaming_response(
        self, 
        prompt: str, 
        model: Optional[str] = None,
        system_prompt: Optional[str] = None,
        context: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048
    ) -> AsyncGenerator[str, None]:
        """Generate a streaming response from Ollama model."""
        model_name = model or self.model
        
        # Construct the full prompt
        full_prompt = ""
        if system_prompt:
            full_prompt += f"System: {system_prompt}\n\n"
        if context:
            full_prompt += f"Context: {context}\n\n"
        full_prompt += f"User: {prompt}\n\nAssistant:"
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                payload = {
                    "model": model_name,
                    "prompt": full_prompt,
                    "stream": True,
                    "options": {
                        "temperature": temperature,
                        "num_predict": max_tokens
                    }
                }
                
                async with client.stream(
                    "POST",
                    f"{self.base_url}/api/generate",
                    json=payload
                ) as response:
                    if response.status_code == 200:
                        async for chunk in response.aiter_lines():
                            if chunk:
                                try:
                                    data = json.loads(chunk)
                                    if "response" in data:
                                        yield data["response"]
                                    if data.get("done", False):
                                        break
                                except json.JSONDecodeError:
                                    continue
                    else:
                        yield "Sorry, I encountered an error processing your request."
                        
        except Exception as e:
            logger.error(f"Error generating streaming response: {e}")
            yield "Sorry, I'm currently unavailable. Please try again later."
    
    async def summarize_content(self, content: str, max_length: int = 300) -> str:
        """Summarize content using Ollama."""
        system_prompt = f"""You are a helpful assistant that summarizes educational content about Huawei Cloud Computing and ICT topics. 
        Create a clear, concise summary in approximately {max_length} words that captures the key concepts and learning objectives."""
        
        prompt = f"Please summarize the following content:\n\n{content}"
        
        return await self.generate_response(
            prompt=prompt,
            system_prompt=system_prompt,
            temperature=0.3,
            max_tokens=max_length * 2
        )
    
    async def generate_quiz_questions(self, content: str, num_questions: int = 5) -> List[Dict]:
        """Generate quiz questions from content."""
        system_prompt = """You are an expert in creating educational quiz questions for Huawei Cloud Computing and ICT topics. 
        Create multiple choice questions with 4 options each. Respond in JSON format with an array of questions.
        Each question should have: question, options (array of 4 strings), correct_answer (index 0-3), explanation."""
        
        prompt = f"""Based on the following content, create {num_questions} multiple choice questions:

{content}

Respond with a JSON array of questions in this format:
[
  {{
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": 0,
    "explanation": "Explanation of why this is correct"
  }}
]"""
        
        response = await self.generate_response(
            prompt=prompt,
            system_prompt=system_prompt,
            temperature=0.4,
            max_tokens=1500
        )
        
        try:
            # Try to extract JSON from the response
            import re
            json_match = re.search(r'\[.*\]', response, re.DOTALL)
            if json_match:
                questions = json.loads(json_match.group())
                return questions[:num_questions]  # Ensure we don't exceed requested number
        except (json.JSONDecodeError, AttributeError):
            logger.error(f"Failed to parse quiz questions JSON: {response}")
        
        # Fallback: return empty list if JSON parsing fails
        return []
    
    async def answer_question(self, question: str, context: str = "") -> str:
        """Answer a question based on provided context."""
        system_prompt = """You are a knowledgeable tutor specializing in Huawei Cloud Computing and ICT topics. 
        Provide clear, accurate, and helpful answers to student questions. If you're not certain about something, say so.
        Use the provided context to inform your answer, but also draw on your general knowledge when appropriate."""
        
        return await self.generate_response(
            prompt=question,
            system_prompt=system_prompt,
            context=context,
            temperature=0.3
        )
    
    async def explain_concept(self, concept: str, context: str = "", difficulty_level: str = "intermediate") -> str:
        """Explain a concept in detail."""
        system_prompt = f"""You are an expert teacher explaining Huawei Cloud Computing and ICT concepts. 
        Explain the concept clearly for a {difficulty_level} level student. 
        Use examples and analogies when helpful. Structure your explanation logically."""
        
        prompt = f"Please explain the concept: {concept}"
        
        return await self.generate_response(
            prompt=prompt,
            system_prompt=system_prompt,
            context=context,
            temperature=0.4
        )
    
    async def generate_flashcards(self, content: str, num_cards: int = 10) -> List[Dict]:
        """Generate flashcards from content."""
        system_prompt = """You are creating educational flashcards for Huawei Cloud Computing and ICT topics.
        Create clear, concise flashcards with a question/term on the front and answer/definition on the back.
        Respond in JSON format with an array of flashcards."""
        
        prompt = f"""Based on the following content, create {num_cards} flashcards:

{content}

Respond with a JSON array in this format:
[
  {{
    "front": "Question or term",
    "back": "Answer or definition",
    "category": "Topic category",
    "difficulty": "easy|medium|hard"
  }}
]"""
        
        response = await self.generate_response(
            prompt=prompt,
            system_prompt=system_prompt,
            temperature=0.4,
            max_tokens=1500
        )
        
        try:
            import re
            json_match = re.search(r'\[.*\]', response, re.DOTALL)
            if json_match:
                flashcards = json.loads(json_match.group())
                return flashcards[:num_cards]
        except (json.JSONDecodeError, AttributeError):
            logger.error(f"Failed to parse flashcards JSON: {response}")
        
        return []