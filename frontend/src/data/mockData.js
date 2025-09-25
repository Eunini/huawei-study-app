// Mock study materials data
export const mockStudyMaterials = [
  {
    id: '1',
    title: 'HCIA Cloud Computing Fundamentals',
    content: `# Cloud Computing Overview

Cloud computing is a model for enabling ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources that can be rapidly provisioned and released with minimal management effort.

## Key Characteristics

### 1. On-demand self-service
Users can provision computing capabilities automatically without human interaction with service providers.

### 2. Broad network access
Services are available over the network through standard mechanisms.

### 3. Resource pooling
Computing resources are pooled to serve multiple consumers using multi-tenant model.

### 4. Rapid elasticity
Resources can be elastically provisioned and released to scale rapidly.

### 5. Measured service
Cloud systems automatically control and optimize resource use.

## Service Models

### Infrastructure as a Service (IaaS)
- Provides virtualized computing resources
- Examples: Virtual machines, storage, networks
- User manages: OS, middleware, runtime, data, applications

### Platform as a Service (PaaS)
- Provides platform and environment for developers
- Examples: Development frameworks, databases
- User manages: Data and applications

### Software as a Service (SaaS)
- Provides complete software applications
- Examples: Email, CRM, office applications
- User manages: Data only

## Deployment Models

### Public Cloud
- Open for public use
- Owned by cloud service provider
- Examples: AWS, Azure, Huawei Cloud

### Private Cloud
- Used exclusively by single organization
- Can be on-premises or hosted

### Hybrid Cloud
- Combination of public and private clouds
- Allows data and applications to be shared

### Community Cloud
- Shared by several organizations
- Supports specific community with shared concerns`,
    category: 'HCIA',
    description: 'Introduction to cloud computing concepts and models',
    readTime: '15 min',
    difficulty: 'easy',
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    title: 'Huawei Cloud Services Overview',
    content: `# Huawei Cloud Core Services

## Compute Services

### Elastic Cloud Server (ECS)
- Virtual machines in the cloud
- Multiple instance types for different workloads
- Auto scaling capabilities
- Pay-as-you-use pricing

### Bare Metal Server (BMS)
- Dedicated physical servers
- High performance for demanding applications
- Direct hardware access

### Auto Scaling (AS)
- Automatically adjusts computing resources
- Based on demand and policies
- Ensures optimal performance and cost

### Function Graph
- Serverless computing service
- Event-driven execution
- Pay per invocation

## Storage Services

### Object Storage Service (OBS)
- Scalable object storage
- 99.999999999% (11 9's) durability
- Multiple storage classes
- RESTful API access

### Elastic Volume Service (EVS)
- Block storage for ECS instances
- High performance and reliability
- Snapshot and backup capabilities

### Scalable File Service (SFS)
- Shared file storage
- NFS protocol support
- Concurrent access from multiple instances

### Cloud Backup and Recovery (CBR)
- Backup and restore services
- Automated backup policies
- Cross-region backup support

## Network Services

### Virtual Private Cloud (VPC)
- Isolated network environment
- Custom IP address ranges
- Subnets and route tables
- Security groups and ACLs

### Elastic Load Balancer (ELB)
- Distributes traffic across instances
- Multiple load balancing algorithms
- Health checks and auto failover

### NAT Gateway
- Enables internet access for private subnets
- SNAT and DNAT capabilities
- High availability and scalability

### VPN Gateway
- Secure connections to on-premises
- Site-to-site and point-to-site VPN
- IPsec and SSL VPN support

## Database Services

### Relational Database Service (RDS)
- Managed database service
- Multiple database engines (MySQL, PostgreSQL, SQL Server)
- Automated backups and maintenance

### Document Database Service (DDS)
- MongoDB-compatible database
- Flexible document model
- Auto scaling and high availability

### GaussDB
- Enterprise-grade distributed database
- HTAP (Hybrid Transaction/Analytical Processing)
- High performance and scalability

### Distributed Cache Service (DCS)
- In-memory caching service
- Redis and Memcached compatible
- High availability and data persistence`,
    category: 'HCIA',
    description: 'Overview of core Huawei Cloud services',
    readTime: '25 min',
    difficulty: 'medium',
    lastUpdated: '2024-01-20'
  },
  {
    id: '3',
    title: 'HCIP Cloud Architecture Design',
    content: `# Cloud Architecture Design Principles

## Core Design Principles

### 1. Scalability and Elasticity
- **Horizontal Scaling**: Add more instances to handle increased load
- **Vertical Scaling**: Increase resources of existing instances
- **Auto Scaling**: Automatically adjust resources based on demand
- **Load Distribution**: Spread workload across multiple resources

### 2. High Availability and Fault Tolerance
- **Redundancy**: Multiple instances across availability zones
- **Failover**: Automatic switching to backup systems
- **Health Monitoring**: Continuous monitoring of system health
- **Disaster Recovery**: Plans for catastrophic failures

### 3. Security and Compliance
- **Defense in Depth**: Multiple layers of security
- **Encryption**: Data at rest and in transit
- **Access Control**: Identity and access management
- **Compliance**: Meeting regulatory requirements

### 4. Cost Optimization
- **Right Sizing**: Matching resources to actual needs
- **Reserved Instances**: Long-term commitments for discounts
- **Spot Instances**: Using spare capacity at reduced costs
- **Resource Monitoring**: Tracking usage and costs

### 5. Performance Efficiency
- **Resource Selection**: Choosing appropriate services and configurations
- **Monitoring**: Continuous performance monitoring
- **Optimization**: Regular performance tuning
- **Caching**: Using caching to improve response times

## Architecture Patterns

### Multi-tier Architecture
- **Presentation Tier**: User interface and user experience
- **Application Tier**: Business logic and processing
- **Data Tier**: Data storage and management
- **Benefits**: Separation of concerns, scalability, maintainability

### Microservices Architecture
- **Service Decomposition**: Breaking monolith into small services
- **Independent Deployment**: Each service can be deployed separately
- **Technology Diversity**: Different technologies for different services
- **Challenges**: Complexity, service communication, data consistency

### Serverless Architecture
- **Function as a Service (FaaS)**: Event-driven function execution
- **No Server Management**: Focus on code, not infrastructure
- **Auto Scaling**: Automatic scaling based on demand
- **Pay per Use**: Only pay for actual execution time

### Event-driven Architecture
- **Event Producers**: Components that generate events
- **Event Consumers**: Components that process events
- **Event Routing**: Directing events to appropriate consumers
- **Benefits**: Loose coupling, scalability, real-time processing

## Best Practices

### Design for Failure
- Assume components will fail
- Implement circuit breakers
- Use timeouts and retries
- Plan for graceful degradation

### Implement Monitoring and Logging
- Application performance monitoring (APM)
- Infrastructure monitoring
- Centralized logging
- Alerting and notification

### Automate Everything
- Infrastructure as Code (IaC)
- Continuous Integration/Continuous Deployment (CI/CD)
- Automated testing
- Configuration management

### Use Managed Services
- Reduce operational overhead
- Leverage cloud provider expertise
- Focus on business logic
- Improve security and compliance`,
    category: 'HCIP',
    description: 'Advanced cloud architecture design principles',
    readTime: '35 min',
    difficulty: 'hard',
    lastUpdated: '2024-01-25'
  }
]

// Mock flashcards data
export const mockFlashcards = [
  {
    id: '1',
    front: 'What are the 5 essential characteristics of cloud computing according to NIST?',
    back: '1. On-demand self-service\n2. Broad network access\n3. Resource pooling\n4. Rapid elasticity\n5. Measured service',
    category: 'HCIA',
    difficulty: 'easy'
  },
  {
    id: '2',
    front: 'What is the difference between IaaS, PaaS, and SaaS?',
    back: 'IaaS: Infrastructure as a Service - provides virtualized computing resources\nPaaS: Platform as a Service - provides platform and environment for developers\nSaaS: Software as a Service - provides complete software applications',
    category: 'HCIA',
    difficulty: 'medium'
  },
  {
    id: '3',
    front: 'What is Huawei Cloud ECS?',
    back: 'Elastic Cloud Server - Huawei\'s virtual machine service that provides scalable computing capacity in the cloud',
    category: 'HCIA',
    difficulty: 'easy'
  },
  {
    id: '4',
    front: 'What are the main components of a VPC in Huawei Cloud?',
    back: '1. Subnets\n2. Route Tables\n3. Security Groups\n4. Network ACLs\n5. Internet Gateway\n6. NAT Gateway',
    category: 'HCIP',
    difficulty: 'medium'
  },
  {
    id: '5',
    front: 'What is the difference between vertical and horizontal scaling?',
    back: 'Vertical scaling: Increasing resources of existing instances (scale up)\nHorizontal scaling: Adding more instances to handle load (scale out)',
    category: 'HCIP',
    difficulty: 'hard'
  }
]
