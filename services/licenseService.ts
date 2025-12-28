import axios from 'axios';

class LicenseService {
  private readonly baseURL = 'https://boros-license-server.onrender.com';

  async validateLicense(licenseKey: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/validate`,
        { licenseKey },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      return response.data.valid === true;
    } catch (error) {
      console.error('License validation error:', error);
      return false;
    }
  }

  async checkUsage(licenseKey: string): Promise<{ used: number; limit: number } | null> {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/usage/${licenseKey}`,
        {
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Usage check error:', error);
      return null;
    }
  }

  async recordUsage(licenseKey: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/usage`,
        { licenseKey },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      return response.data.success === true;
    } catch (error) {
      console.error('Usage recording error:', error);
      return false;
    }
  }
}

export const licenseService = new LicenseService();