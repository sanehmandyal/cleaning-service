import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { Missing } from './components/Shared.jsx';
import {
  Home,
  Services,
  ServiceDetail,
  Areas,
  AreaDetail,
  Blog,
  BlogPost,
  Gallery,
  Reviews,
  FaqsPage,
  Contact,
  FormPage,
  AboutPage,
  PricingPage,
  WhyChooseUsPage,
  PrivacyPolicyPage,
  TermsConditionsPage,
} from './pages/Public.jsx';
import { Login, AdminLayout, Dashboard, SeoAudit, Resource, Enquiries, Settings, resourceNames } from './admin/Admin.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="seo" element={<SeoAudit />} />
        <Route path="settings" element={<Settings />} />
        {resourceNames.map((n) => <Route key={n} path={n} element={<Resource name={n} />} />)}
      </Route>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/why-choose-us" element={<WhyChooseUsPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/service-areas" element={<Areas />} />
        <Route path="/service-areas/:slug" element={<AreaDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/faqs" element={<FaqsPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book-cleaning" element={<FormPage type="booking" />} />
        <Route path="/get-a-quote" element={<FormPage type="quote" />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}
