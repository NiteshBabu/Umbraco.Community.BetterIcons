import ReactDOM from 'react-dom/client';
import { BetterIconsManagementDashboard } from './IconRegistrationDashboard';

// Dashboard entry point for Umbraco 11-13 (AngularJS)
if (typeof angular !== 'undefined') {
  angular.module('umbraco').controller('BetterIconsManagementDashboardController', ['$scope', function ($scope: any) {
    setTimeout(() => {
      const element = document.getElementById('bettericons-management-dashboard-root');
      if (element) {
        const root = ReactDOM.createRoot(element);
        root.render(<BetterIconsManagementDashboard />);
      }
    }, 100);
  }]);
}
