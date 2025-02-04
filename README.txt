
# Baseball Prospect Predictor - Machine Learning

**Inspiration**

Combining traditional baseball scouting with modern machine learning to create more accurate prospect projections. FanGraphs' unique dataset of scouting grades and advanced statistics provided an opportunity to bridge old-school and new-school baseball analysis.

**What it does**

*   Predicts MLB performance metrics (WAR, ERA, wRC+) for baseball prospects
*   Interactive prospect ranking system with advanced filtering
*   Visual scouting grade analysis through radar charts
*   Comprehensive player pages with minor league statistics
*   Position-specific performance projections

**How we built it**

*   **Data Processing**
    *   Scraped FanGraphs prospect data
    *   Created training dataset by matching historical prospects with MLB outcomes
    *   Preprocessed scouting grades and statistics
*   **ML Implementation**
    *   Trained models on Google Vertex AI using AutoML Regression
    *   Models predicts WAR
    *   Data is recombined with prospect data and organized into JSON for streamlined input to site
*   **Frontend Development**
    *   React with Material UI components
    *   Recharts for data visualization
    *   Context API for state management
    *   Firebase for hosting

**Challenges we ran into**

*   Matching historical prospect data with MLB outcomes
*   Handling missing data and scouting grade variations
*   Dealing with small training dataset, and prospects who haven't yet reached MLB
*   Implementing responsive data grid with dynamic filtering
*   Managing state across complex component hierarchy

**Accomplishments that we're proud of**

*   Successfully trained ML models with strong predictive accuracy
*   Created intuitive interface for complex baseball data
*   Implemented interactive scouting visualizations
*   Developed prospect filtering system

**What we learned**

*   AutoML regression techniques
*   React Context API implementation
*   Google Cloud Infrastructure

**What's next for Baseball Prospect Predictor - Machine Learning**

*   Real-time data updates
*   Sequential Prospect Data Input
*   Comparative player projections
*   Historical accuracy tracking
