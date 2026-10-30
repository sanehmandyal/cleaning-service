import fs from 'fs';
import path from 'path';

const file = path.resolve('client/src/pages/Public.jsx');
let code = fs.readFileSync(file, 'utf8');

// 1. In Areas()
const areasTarget = "export function Areas() {\n  const { data, loading } = useApi('/public/areas');";
const areasReplacement = "export function Areas() {\n  const { data, loading } = useApi('/public/areas');\n  const areasList = (data && data.length > 0) ? data : areasData;";
code = code.replace(areasTarget, areasReplacement);
code = code.replace("{(data || []).map((a) => (", "{areasList.map((a) => (");

// 2. In AreaDetail()
const areaDetailTarget = "export function AreaDetail() {\n  const { slug } = useParams();\n  const { data: a, loading, error } = useApi(`/public/areas/${slug}`);\n  const { data: svcs } = useApi('/public/services');\n  const { data: areas } = useApi('/public/areas');";
const areaDetailReplacement = "export function AreaDetail() {\n  const { slug } = useParams();\n  const { data: aApi, loading } = useApi(`/public/areas/${slug}`);\n  const { data: svcsApi } = useApi('/public/services');\n  const { data: areasApi } = useApi('/public/areas');\n  const a = aApi || areasData.find((x) => x.slug === slug);\n  const svcs = (svcsApi && svcsApi.length > 0) ? svcsApi : servicesData;\n  const areas = (areasApi && areasApi.length > 0) ? areasApi : areasData;";
code = code.replace(areaDetailTarget, areaDetailReplacement);
code = code.replace("if (loading) return <Loading />;\n  if (error === 'notfound' || !a) return <Missing />;", "if (loading && !a) return <Loading />;\n  if (!a) return <Missing />;");

// 3. In Blog()
const blogTarget = "export function Blog() {\n  const { data, loading } = useApi('/public/blog');";
const blogReplacement = "export function Blog() {\n  const { data, loading } = useApi('/public/blog');\n  const blogList = (data && data.length > 0) ? data : blogData;";
code = code.replace(blogTarget, blogReplacement);
code = code.replace("{(data || []).map((p) => (", "{blogList.map((p) => (");

// 4. In BlogPost()
const blogPostTarget = "export function BlogPost() {\n  const { slug } = useParams();\n  const { data: p, loading, error } = useApi(`/public/blog/${slug}`);\n  const { data: svcs } = useApi('/public/services');";
const blogPostReplacement = "export function BlogPost() {\n  const { slug } = useParams();\n  const { data: pApi, loading } = useApi(`/public/blog/${slug}`);\n  const { data: svcsApi } = useApi('/public/services');\n  const p = pApi || blogData.find((x) => x.slug === slug);\n  const svcs = (svcsApi && svcsApi.length > 0) ? svcsApi : servicesData;";
code = code.replace(blogPostTarget, blogPostReplacement);
code = code.replace("if (loading) return <Loading />;\n  if (error === 'notfound' || !p) return <Missing />;", "if (loading && !p) return <Loading />;\n  if (!p) return <Missing />;");

fs.writeFileSync(file, code, 'utf8');
console.log('Public.jsx successfully updated with fail-safe fallbacks!');
