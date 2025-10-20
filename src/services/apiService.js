// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.russellmorbey.co.uk';

// Consolidated API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.apiKeys = {
      strava: process.env.REACT_APP_STRAVA_API_KEY,
      fundraising: process.env.REACT_APP_FUNDRAISING_API_KEY
    };
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      }
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${response.statusText} - ${errorText}`);
    }
    
    return await response.json();
  }

  // Strava API calls
  async getStravaFeed(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/strava-integration/feed${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint, {
      headers: {
        'X-API-Key': this.apiKeys.strava
      }
    });
  }

  async getStravaHealth() {
    return this.makeRequest('/api/strava-integration/health');
  }

  async getStravaMetrics() {
    return this.makeRequest('/api/strava-integration/metrics', {
      headers: {
        'X-API-Key': this.apiKeys.strava
      }
    });
  }

  async getStravaCacheStatus() {
    return this.makeRequest('/api/strava-integration/cache-status', {
      headers: {
        'X-API-Key': this.apiKeys.strava
      }
    });
  }

  // Fundraising API calls
  async getFundraisingData() {
    return this.makeRequest('/api/fundraising/data', {
      headers: {
        'X-API-Key': this.apiKeys.fundraising
      }
    });
  }

  async getFundraisingDonations(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/fundraising/donations${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint, {
      headers: {
        'X-API-Key': this.apiKeys.fundraising
      }
    });
  }

  async getFundraisingHealth() {
    return this.makeRequest('/api/fundraising/health');
  }

  // General API calls
  async getHealth() {
    return this.makeRequest('/health');
  }

  async getApiInfo() {
    return this.makeRequest('/');
  }
}

// Legacy API classes for backward compatibility
class StravaAPI {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async getFeed(limit = null) {
    try {
      const params = limit ? { limit } : {};
      const data = await this.apiService.getStravaFeed(params);
      // console.log('API response - Activities count:', data.activities?.length || 0);
      return data;
    } catch (error) {
      console.error('Error fetching Strava activities:', error);
      throw error;
    }
  }

  async getActivity(activityId) {
    try {
      return await this.apiService.makeRequest(`/api/strava-integration/activity/${activityId}`, {
        headers: {
          'X-API-Key': this.apiService.apiKeys.strava
        }
      });
    } catch (error) {
      console.error('Error fetching Strava activity:', error);
      throw error;
    }
  }
}

class FundraisingAPI {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async getData() {
    try {
      return await this.apiService.getFundraisingData();
    } catch (error) {
      console.error('Error fetching fundraising data:', error);
      throw error;
    }
  }

  async getDonations() {
    try {
      return await this.apiService.getFundraisingDonations();
    } catch (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }
  }
}

// API utilities
export const apiUtils = {
  formatError: (error) => {
    if (error.message) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unexpected error occurred';
  }
};

// Create API service instance
const apiService = new ApiService();

// Export API instances for backward compatibility
export const stravaAPI = new StravaAPI(apiService);
export const fundraisingAPI = new FundraisingAPI(apiService);
export { apiService };