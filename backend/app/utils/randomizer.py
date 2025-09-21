import random
from typing import List, Dict, Any

class QuestionRandomizer:
    """Service for randomizing and selecting questions for exams"""
    
    def __init__(self):
        self.random = random.Random()
    
    def select_questions(self, questions: List[Dict], count: int) -> List[Dict]:
        """
        Select a random subset of questions
        
        Args:
            questions: List of question dictionaries
            count: Number of questions to select
            
        Returns:
            List of selected questions
        """
        if not questions:
            return []
        
        # If we have fewer questions than requested, return all
        if len(questions) <= count:
            return self.shuffle_questions(questions)
        
        # Randomly select questions
        selected = self.random.sample(questions, count)
        return self.shuffle_questions(selected)
    
    def shuffle_questions(self, questions: List[Dict]) -> List[Dict]:
        """
        Shuffle the order of questions
        
        Args:
            questions: List of question dictionaries
            
        Returns:
            Shuffled list of questions
        """
        shuffled = questions.copy()
        self.random.shuffle(shuffled)
        return shuffled
    
    def shuffle_options(self, question: Dict) -> Dict:
        """
        Shuffle the options for a multiple choice question
        
        Args:
            question: Question dictionary with options
            
        Returns:
            Question with shuffled options
        """
        if question.get("question_type") != "multiple_choice" or not question.get("options"):
            return question
        
        question_copy = question.copy()
        correct_answer = question_copy["correct_answer"]
        
        # Shuffle options
        options = question_copy["options"].copy()
        self.random.shuffle(options)
        
        question_copy["options"] = options
        return question_copy
    
    def generate_exam_id(self) -> str:
        """Generate a unique exam ID"""
        import uuid
        return str(uuid.uuid4())
    
    def set_seed(self, seed: int):
        """Set random seed for reproducible results (useful for testing)"""
        self.random.seed(seed)
