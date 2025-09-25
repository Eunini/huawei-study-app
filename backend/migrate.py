"""
Database migration script for ODFS and AI features
Run this script to create the new tables and update existing ones
"""

from sqlalchemy import create_engine
from app.config import settings
from app.models import Base
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_migrations():
    """Create all tables and run any necessary migrations."""
    try:
        # Create engine
        engine = create_engine(settings.DATABASE_URL)
        
        # Create all tables
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully!")
        
        # You can add any data migrations here
        logger.info("Running data migrations...")
        
        # Example: Add default ODFS modules
        add_default_odfs_modules(engine)
        
        logger.info("✅ All migrations completed successfully!")
        
    except Exception as e:
        logger.error(f"❌ Migration failed: {e}")
        raise

def add_default_odfs_modules(engine):
    """Add some default ODFS modules for testing."""
    from sqlalchemy.orm import sessionmaker
    from app.models import ODFSModule
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Check if modules already exist
        existing_modules = db.query(ODFSModule).count()
        if existing_modules > 0:
            logger.info("ODFS modules already exist, skipping default data creation")
            return
        
        # Sample ODFS modules for Huawei ICT Cloud Track
        default_modules = [
            {
                "title": "Cloud Computing Fundamentals",
                "module_code": "HCIP-CC-001",
                "description": "Introduction to cloud computing concepts, service models, and deployment models",
                "learning_objectives": [
                    "Understand cloud computing characteristics",
                    "Differentiate between IaaS, PaaS, and SaaS",
                    "Compare public, private, and hybrid clouds"
                ],
                "content": """
                # Cloud Computing Fundamentals
                
                ## Introduction
                Cloud computing is a model for enabling ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources that can be rapidly provisioned and released with minimal management effort or service provider interaction.
                
                ## Key Characteristics
                1. **On-demand self-service**: Users can provision computing capabilities automatically
                2. **Broad network access**: Capabilities available over the network via standard mechanisms
                3. **Resource pooling**: Resources are pooled to serve multiple consumers
                4. **Rapid elasticity**: Capabilities can be elastically provisioned and released
                5. **Measured service**: Resource usage can be monitored, controlled, and reported
                
                ## Service Models
                - **Infrastructure as a Service (IaaS)**: Virtual machines, storage, networks
                - **Platform as a Service (PaaS)**: Development platforms, databases, middleware
                - **Software as a Service (SaaS)**: Complete applications delivered over the internet
                """,
                "estimated_duration_hours": 8,
                "difficulty_level": "beginner",
                "prerequisites": ["Basic IT knowledge", "Networking fundamentals"],
                "resources": ["Official Huawei Cloud documentation", "Practice labs", "Video tutorials"]
            },
            {
                "title": "Huawei Cloud ECS (Elastic Cloud Server)",
                "module_code": "HCIP-CC-002", 
                "description": "Comprehensive guide to Huawei Cloud Elastic Cloud Server management and operations",
                "learning_objectives": [
                    "Create and manage ECS instances",
                    "Configure security groups and networking",
                    "Implement backup and disaster recovery",
                    "Monitor and optimize ECS performance"
                ],
                "content": """
                # Huawei Cloud ECS (Elastic Cloud Server)
                
                ## Overview
                Elastic Cloud Server (ECS) is Huawei Cloud's Infrastructure as a Service offering that provides scalable computing resources in the cloud.
                
                ## Key Features
                - **Multiple instance types**: General Purpose, Compute Optimized, Memory Optimized
                - **Flexible billing**: Pay-per-use or subscription models
                - **Auto Scaling**: Automatically adjust capacity based on demand
                - **Security**: Advanced security groups and encryption
                
                ## Instance Management
                ### Creating an ECS Instance
                1. Log in to Huawei Cloud Console
                2. Navigate to ECS service
                3. Click "Buy ECS"
                4. Configure specifications, image, and network
                5. Set security groups and key pairs
                6. Review and create instance
                
                ### Security Groups
                Security groups act as virtual firewalls controlling inbound and outbound traffic:
                - Default deny all inbound traffic
                - Allow all outbound traffic
                - Rules based on protocol, port, and source/destination
                
                ## Best Practices
                - Use appropriate instance types for workload
                - Implement proper security group rules
                - Regular backups and snapshots
                - Monitor resource utilization
                """,
                "estimated_duration_hours": 12,
                "difficulty_level": "intermediate",
                "prerequisites": ["Cloud Computing Fundamentals", "Linux/Windows administration"],
                "resources": ["Huawei Cloud ECS documentation", "Hands-on labs", "Configuration templates"]
            },
            {
                "title": "Virtual Private Cloud (VPC) and Networking",
                "module_code": "HCIP-CC-003",
                "description": "Master VPC design, subnet management, and network security in Huawei Cloud",
                "learning_objectives": [
                    "Design and implement VPC architectures",
                    "Configure subnets and routing tables", 
                    "Set up VPN and Direct Connect",
                    "Implement network security best practices"
                ],
                "content": """
                # Virtual Private Cloud (VPC) and Networking
                
                ## VPC Overview
                A Virtual Private Cloud (VPC) provides an isolated virtual network environment where you can deploy cloud resources securely.
                
                ## Core Components
                
                ### Subnets
                - **Public Subnets**: Direct internet access via Internet Gateway
                - **Private Subnets**: No direct internet access, use NAT for outbound
                - **CIDR Planning**: Proper IP address space allocation
                
                ### Routing Tables
                - Control traffic routing within VPC
                - Associate with subnets
                - Custom routes for specific requirements
                
                ### Security Features
                - **Security Groups**: Instance-level firewall
                - **NACLs**: Subnet-level access control
                - **VPC Flow Logs**: Network traffic monitoring
                
                ## Connectivity Options
                
                ### VPN Gateway
                - Site-to-site VPN connections
                - Client VPN for remote access
                - IPSec encryption
                
                ### Direct Connect
                - Dedicated network connection
                - Consistent network performance
                - Hybrid cloud architectures
                
                ## Best Practices
                1. **Network Segmentation**: Separate environments (dev, test, prod)
                2. **IP Planning**: Non-overlapping CIDR blocks
                3. **Security**: Least privilege access
                4. **Monitoring**: Enable flow logs and monitoring
                5. **Redundancy**: Multi-AZ deployment
                """,
                "estimated_duration_hours": 10,
                "difficulty_level": "intermediate", 
                "prerequisites": ["Networking fundamentals", "TCP/IP concepts", "Huawei Cloud ECS"],
                "resources": ["VPC architecture guides", "Network design templates", "Security best practices"]
            }
        ]
        
        for module_data in default_modules:
            module = ODFSModule(**module_data)
            db.add(module)
        
        db.commit()
        logger.info(f"✅ Added {len(default_modules)} default ODFS modules")
        
    except Exception as e:
        logger.error(f"❌ Failed to add default modules: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_migrations()