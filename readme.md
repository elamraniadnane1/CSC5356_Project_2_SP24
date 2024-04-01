# Twitter-Like Recommendation System

## Project Overview
This project implements a Twitter-like recommendation system. It uses a microservices architecture with a focus on graph-based recommendations. The system suggests hashtags and users to follow based on user tweets and sentiments.
### Key Features
- Post and view tweets.
- Get recommendations based on user activity and sentiment analysis.
- Perform sentiment analysis on tweets.
- Microservices-based architecture for scalability and maintainability.
## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
### Prerequisites
- Python 3.x
- Neo4j
- MongoDB
- Kafka
- NPM
- React.js / Node.js Framework
- Apache Spark (for Spark Streaming)
- Neo4j, Mongo DB Connectors
- Docker Container
### Installation
1. Clone the repository: git clone https://github.com/elamraniadnane1/Project_3.git
2. Navigate to the project directory and install the required Python packages:
cd your-repo
pip install -r requirements.txt

### Running the Application
1. Start the Neo4j and MongoDB databases, and ensure Kafka and Spark Streaming are running.
2. Run the microservices:
python -m web_application.app
## Usage
- Access the web application at `http://localhost:5004`.
- Post tweets, and view recommendations and sentiment analysis results.

## Built With
- [Node.js](https://nodejs.org/en/) - The web framework used.
- [React.js](https://react.dev/) - Another front-end framework
- [Neo4j](https://neo4j.com/) - Graph database.
- [MongoDB](https://www.mongodb.com/) - Document database.
- [Kafka](https://kafka.apache.org/) - Streaming platform.
- [Spark](https://spark.apache.org/) - Unified analytics engine.

## Versioning
We use [GitHub](https://github.com/elamraniadnane1/Project_3) for versioning.

## Authors
- **Adnane El Amrani** - *AUI MSSE Student* - [elamraniadnane1](https://github.com/elamraniadnane1)
- **Ayoub Maimmadi** - *AUI MSSE Student* - [/AyoubMaimmadi](https://github.com/ayoubMaimmadi/)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


# Project Report Outline

This document provides an outline of the project report, detailing the structure and content of each section. The report is structured into several key sections, each focusing on a different aspect of the project.

## Report Structure

- **Project Team**
  - Table with team members and their respective roles and contributions.

- **Project Definition**
  - Brief description of project goals.
  - Functional and non-functional requirements.
  - Requirements on architecture.

- **Project Design**
  - Discussion on data models, encoding, and querying.
  - Configurations for scalability and reliability in NoSQL databases.
  - Justification for any architectural deviations from the proposed design.

- **Project Implementation**
  - Subsections for each component's deployment.
  - Key configuration parameters and considerations.
  - Libraries used, major code snippets.
  - Data models, encoding techniques.
  - Unit tests and integration tests.
  - Subsection on test dataset preparation.

- **Implementation Limitations**
  - Discussion on parts not implemented, performance issues, bugs, hardcoded data.

- **Project Demo and Codebase**
  - Check Canvas
