from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.schemas import StudyMaterialResponse, FlashcardResponse, UserResponse
from app.routes.auth import get_current_user
from app.database import get_supabase_client
from supabase import Client
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Static study materials for MVP
STATIC_STUDY_MATERIALS = [
    {
        "id": "1",
        "title": "HCIA Cloud Computing Fundamentals",
        "content": """
        **Cloud Computing Overview**
        
        Cloud computing is a model for enabling ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources that can be rapidly provisioned and released with minimal management effort.
        
        **Key Characteristics:**
        - On-demand self-service
        - Broad network access
        - Resource pooling
        - Rapid elasticity
        - Measured service
        
        **Service Models:**
        - IaaS (Infrastructure as a Service)
        - PaaS (Platform as a Service)
        - SaaS (Software as a Service)
        
        **Deployment Models:**
        - Public Cloud
        - Private Cloud
        - Hybrid Cloud
        - Community Cloud
        """,
        "category": "HCIA",
        "description": "Introduction to cloud computing concepts and models"
    },
    {
        "id": "2",
        "title": "Huawei Cloud Services Overview",
        "content": """
        **Huawei Cloud Core Services**
        
        **Compute Services:**
        - ECS (Elastic Cloud Server)
        - BMS (Bare Metal Server)
        - Auto Scaling
        - Function Graph (Serverless)
        
        **Storage Services:**
        - OBS (Object Storage Service)
        - EVS (Elastic Volume Service)
        - SFS (Scalable File Service)
        - CBR (Cloud Backup and Recovery)
        
        **Network Services:**
        - VPC (Virtual Private Cloud)
        - ELB (Elastic Load Balancer)
        - NAT Gateway
        - VPN Gateway
        
        **Database Services:**
        - RDS (Relational Database Service)
        - DDS (Document Database Service)
        - GaussDB
        - DCS (Distributed Cache Service)
        """,
        "category": "HCIA",
        "description": "Overview of core Huawei Cloud services"
    },
    {
        "id": "3",
        "title": "HCIP Cloud Architecture Design",
        "content": """
        **Cloud Architecture Principles**
        
        **Design Principles:**
        - Scalability and Elasticity
        - High Availability and Fault Tolerance
        - Security and Compliance
        - Cost Optimization
        - Performance Efficiency
        
        **Architecture Patterns:**
        - Multi-tier Architecture
        - Microservices Architecture
        - Serverless Architecture
        - Event-driven Architecture
        
        **Best Practices:**
        - Use managed services when possible
        - Implement proper monitoring and logging
        - Design for failure
        - Automate everything
        - Follow security best practices
        """,
        "category": "HCIP",
        "description": "Advanced cloud architecture design principles"
    }
]

# Static flashcards for MVP
STATIC_FLASHCARDS = [
    {
        "id": "1",
        "front": "What are the 5 essential characteristics of cloud computing according to NIST?",
        "back": "1. On-demand self-service\n2. Broad network access\n3. Resource pooling\n4. Rapid elasticity\n5. Measured service",
        "category": "HCIA",
        "difficulty": "easy"
    },
    {
        "id": "2",
        "front": "What is the difference between IaaS, PaaS, and SaaS?",
        "back": "IaaS: Infrastructure as a Service - provides virtualized computing resources\nPaaS: Platform as a Service - provides platform and environment for developers\nSaaS: Software as a Service - provides complete software applications",
        "category": "HCIA",
        "difficulty": "medium"
    },
    {
        "id": "3",
        "front": "What is Huawei Cloud ECS?",
        "back": "Elastic Cloud Server - Huawei's virtual machine service that provides scalable computing capacity in the cloud",
        "category": "HCIA",
        "difficulty": "easy"
    },
    {
        "id": "4",
        "front": "What are the main components of a VPC in Huawei Cloud?",
        "back": "1. Subnets\n2. Route Tables\n3. Security Groups\n4. Network ACLs\n5. Internet Gateway\n6. NAT Gateway",
        "category": "HCIP",
        "difficulty": "medium"
    },
    {
        "id": "5",
        "front": "What is the difference between vertical and horizontal scaling?",
        "back": "Vertical scaling: Increasing resources of existing instances (scale up)\nHorizontal scaling: Adding more instances to handle load (scale out)",
        "category": "HCIP",
        "difficulty": "hard"
    }
]

@router.get("/materials", response_model=List[StudyMaterialResponse])
async def get_study_materials(
    category: str = None,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get study materials"""
    try:
        materials = STATIC_STUDY_MATERIALS
        
        if category:
            materials = [m for m in materials if m["category"].lower() == category.lower()]
        
        return [
            StudyMaterialResponse(
                id=material["id"],
                title=material["title"],
                content=material["content"],
                category=material["category"],
                description=material["description"],
                created_at="2024-01-01T00:00:00Z"
            )
            for material in materials
        ]
        
    except Exception as e:
        logger.error(f"Get study materials error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch study materials"
        )

@router.get("/materials/{material_id}", response_model=StudyMaterialResponse)
async def get_study_material(
    material_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get specific study material"""
    try:
        material = next((m for m in STATIC_STUDY_MATERIALS if m["id"] == material_id), None)
        
        if not material:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Study material not found"
            )
        
        return StudyMaterialResponse(
            id=material["id"],
            title=material["title"],
            content=material["content"],
            category=material["category"],
            description=material["description"],
            created_at="2024-01-01T00:00:00Z"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get study material error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch study material"
        )

@router.get("/flashcards", response_model=List[FlashcardResponse])
async def get_flashcards(
    category: str = None,
    difficulty: str = None,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get flashcards"""
    try:
        flashcards = STATIC_FLASHCARDS
        
        if category:
            flashcards = [f for f in flashcards if f["category"].lower() == category.lower()]
        
        if difficulty:
            flashcards = [f for f in flashcards if f["difficulty"].lower() == difficulty.lower()]
        
        return [
            FlashcardResponse(
                id=flashcard["id"],
                front=flashcard["front"],
                back=flashcard["back"],
                category=flashcard["category"],
                difficulty=flashcard["difficulty"],
                created_at="2024-01-01T00:00:00Z"
            )
            for flashcard in flashcards
        ]
        
    except Exception as e:
        logger.error(f"Get flashcards error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch flashcards"
        )

@router.get("/search")
async def search_study_materials(
    query: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Search study materials"""
    try:
        if not query or len(query.strip()) < 2:
            return {"materials": [], "flashcards": []}
        
        query_lower = query.lower()
        
        # Search in study materials
        matching_materials = []
        for material in STATIC_STUDY_MATERIALS:
            if (query_lower in material["title"].lower() or 
                query_lower in material["content"].lower() or 
                query_lower in material["category"].lower()):
                matching_materials.append(StudyMaterialResponse(
                    id=material["id"],
                    title=material["title"],
                    content=material["content"],
                    category=material["category"],
                    description=material["description"],
                    created_at="2024-01-01T00:00:00Z"
                ))
        
        # Search in flashcards
        matching_flashcards = []
        for flashcard in STATIC_FLASHCARDS:
            if (query_lower in flashcard["front"].lower() or 
                query_lower in flashcard["back"].lower() or 
                query_lower in flashcard["category"].lower()):
                matching_flashcards.append(FlashcardResponse(
                    id=flashcard["id"],
                    front=flashcard["front"],
                    back=flashcard["back"],
                    category=flashcard["category"],
                    difficulty=flashcard["difficulty"],
                    created_at="2024-01-01T00:00:00Z"
                ))
        
        return {
            "materials": matching_materials,
            "flashcards": matching_flashcards
        }
        
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Search failed"
        )
