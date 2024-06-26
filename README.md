# Solar Application

A web platform for analyzing and optimizing photovoltaic (PV) systems to enhance their efficiency and performance.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

## Introduction

In the current context of increasing environmental concerns and the need for sustainable energy resources, solar energy
through photovoltaic systems offers a viable and ecological solution for generating electricity. However, to maximize
the benefits of this technology, precise analysis and efficient optimization strategies are essential.

The primary goal of this application is to improve the performance and efficiency of photovoltaic systems, thereby
promoting the use of solar energy. It provides a comprehensive solution for analyzing and optimizing PV panels.

## Features

- **Performance Analysis and Monitoring**: Upload relevant data and receive detailed reports on energy production, solar
  panel efficiency, and other critical metrics.
- **Simulations and Forecasting**: Model different scenarios, analyze the impact of variables like weather conditions,
  and predict long-term energy production.
- **User-Friendly Interface**: Intuitive and easy-to-use interface accessible even to those without advanced technical
  knowledge.
- **Customization**: Personalize the PV system configurations based on specific needs and locations.
- **Security**: Strong measures for protecting user data, including encryption and secure authentication.
- **Reports and Graphical Visualization**: Access detailed reports and graphs illustrating the PV system's performance
  over various time intervals.

## Technologies Used

- **Frontend**: React, TypeScript, MUI (Material-UI)
- **Backend**: Firebase (Firestore, Authentication, Hosting)
- **APIs**: Google Maps API, PVWatts Calculator
- **Others**: Axios for HTTP requests

## Installation

### Prerequisites

- Node.js and npm installed on your machine.
- A Firebase project set up with Firestore and Authentication enabled.
- API keys for Google Maps and PVWatts.

### Steps

1. **Clone the Repository**
   ```sh
   git clone https://github.com/Gqbriel02/solar-application.git
   cd solar-application
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add your Firebase and API keys.
   ```env
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   REACT_APP_PVWATTS_API_KEY=your_pvwatts_api_key
   ```

4. **Run the Application**
   ```sh
   npm start
   ```

## Usage

1. **Register and Log In**: Create an account or log in to access the platform.
2. **Select Location**: Use the interactive map to pinpoint the exact location for the solar panels.
3. **Configure System**: Enter technical specifications such as system capacity, module type, and other parameters.
4. **Analyze Performance**: View the detailed performance metrics and reports generated by the platform.
5. **Save and Review Reports**: Save the results and access them later from the Reports section.

## Learn More

You can learn more in
the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
