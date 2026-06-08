import { createHashRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/Home';
import TrainingPage from './pages/Training';
import TrainingCoursePage from './pages/training/TrainingCourse';
import ServicesPage from './pages/Services';
import AgriculturePage from './pages/services/Agriculture';
import EventsPage from './pages/services/Events';
import InspectionPage from './pages/services/Inspection';
import SurveyMappingPage from './pages/services/SurveyMapping';
import ManufacturingPage from './pages/Manufacturing';
import ContactPage from './pages/Contact';

const router = createHashRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'training', element: <TrainingPage /> },
      { path: 'training/small-rpc', element: <TrainingCoursePage title="Small RPC (7 Days)" /> },
      { path: 'training/medium-rpc', element: <TrainingCoursePage title="Medium RPC" /> },
      { path: 'training/small-and-medium-rpc', element: <TrainingCoursePage title="Small & Medium RPC (10 Days)" /> },
      { path: 'training/inspector-development-course', element: <TrainingCoursePage title="Inspector Development Course" /> },
      { path: 'training/aerial-mapping-and-surveying', element: <TrainingCoursePage title="Aerial Mapping & Surveying" /> },
      { path: 'training/fpv-flying', element: <TrainingCoursePage title="FPV Flying" /> },
      { path: 'training/agri-drone-spray-and-precision-agriculture', element: <TrainingCoursePage title="Agri Drone Spray & Precision Agriculture" /> },
      { path: 'training/aerial-videography-and-photography', element: <TrainingCoursePage title="Aerial Videography & Photography" /> },
      { path: 'training/drone-basics', element: <TrainingCoursePage title="Drone Basics" /> },
      { path: 'training/gis-for-drone-data-processing', element: <TrainingCoursePage title="GIS for Drone Data Processing" /> },
      { path: 'training/drone-repair-and-maintenance', element: <TrainingCoursePage title="Drone Repair & Maintenance" /> },
      { path: 'training/python-for-gis', element: <TrainingCoursePage title="Python for GIS" /> },
      { path: 'training/lidar-and-gis', element: <TrainingCoursePage title="LiDAR & GIS" /> },
      { path: 'training/build-your-own-drone', element: <TrainingCoursePage title="Build Your Own Drone" /> },
      { path: 'training/build-your-racing-drone', element: <TrainingCoursePage title="Build Your Racing Drone" /> },
      { path: 'training/build-your-own-agri-drone', element: <TrainingCoursePage title="Build Your Own Agri Drone" /> },
      { path: 'training/drone-customization', element: <TrainingCoursePage title="Drone Customization" /> },
      { path: 'training/drone-technician-6-months', element: <TrainingCoursePage title="Drone Technician (6 Months)" /> },
      { path: 'training/7-days', element: <TrainingCoursePage title="7 Days Course" /> },
      { path: 'training/15-days', element: <TrainingCoursePage title="15 Days Course" /> },
      { path: 'training/30-days', element: <TrainingCoursePage title="30 Days Course" /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'services/agriculture', element: <AgriculturePage /> },
      { path: 'services/events', element: <EventsPage /> },
      { path: 'services/inspection', element: <InspectionPage /> },
      { path: 'services/survey-mapping', element: <SurveyMappingPage /> },
      { path: 'manufacturing', element: <ManufacturingPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
