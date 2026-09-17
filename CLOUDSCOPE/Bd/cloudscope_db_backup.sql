--
-- PostgreSQL database dump
--

\restrict AJdE00c3vIetM0dOJRKMpH5cdwYpimgLTfHQCOSGPlZP2pW7xxayVKzhBxjFrT7

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id character varying(64) NOT NULL,
    created_at character varying(255),
    description text,
    edges_json text,
    name character varying(255) NOT NULL,
    nodes_json text,
    updated_at character varying(255),
    version character varying(16)
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying(64) NOT NULL,
    created_at character varying(255),
    email character varying(255) NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    region character varying(32)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, created_at, description, edges_json, name, nodes_json, updated_at, version) FROM stdin;
proj_aws_demo	2026-09-16T23:41:36.164255400Z	3-Tier architecture saved in PostgreSQL	[]	AWS Production Architecture	[{"data":"System.Collections.Hashtable","id":"ec2_1","type":"ec2"}]	2026-09-16T23:41:36.164255400Z	1.0
proj_aws-3tier	2026-09-16T23:49:50.181249200Z	Arquitectura clásica de 3 capas de alta disponibilidad: ALB en subnet pública, instancias EC2 en capa privada y base de datos relacional RDS Multi-AZ.	[{"id":"e_igw_vpc","source":"node_igw","target":"node_vpc","animated":true},{"id":"e_igw_subpub","source":"node_igw","target":"node_subnet_pub"},{"id":"e_subpub_alb","source":"node_subnet_pub","target":"node_alb"},{"id":"e_alb_subpriv","source":"node_alb","target":"node_subnet_priv"},{"id":"e_subpriv_ec2_1","source":"node_subnet_priv","target":"node_ec2_1"},{"id":"e_subpriv_ec2_2","source":"node_subnet_priv","target":"node_ec2_2"},{"id":"e_ec2_1_rds","source":"node_ec2_1","target":"node_rds"},{"id":"e_ec2_2_rds","source":"node_ec2_2","target":"node_rds"},{"id":"e_ec2_1_s3","source":"node_ec2_1","target":"node_s3","animated":true}]	AWS 3-Tier Enterprise Web App	[{"id":"node_vpc","type":"cloudNode","position":{"x":50,"y":50},"data":{"cloudType":"vpc","label":"Production VPC","config":{"cidr":"10.0.0.0/16","enableDnsHostnames":true}}},{"id":"node_igw","type":"cloudNode","position":{"x":320,"y":50},"data":{"cloudType":"igw","label":"Internet Gateway","config":{}}},{"id":"node_subnet_pub","type":"cloudNode","position":{"x":320,"y":170},"data":{"cloudType":"subnet","label":"Public Subnet (ALB)","config":{"cidr":"10.0.1.0/24","isPublic":true,"availabilityZone":"us-east-1a"}}},{"id":"node_alb","type":"cloudNode","position":{"x":320,"y":290},"data":{"cloudType":"alb","label":"App Load Balancer","config":{"scheme":"internet-facing"}}},{"id":"node_subnet_priv","type":"cloudNode","position":{"x":320,"y":410},"data":{"cloudType":"subnet","label":"Private App Subnet","config":{"cidr":"10.0.2.0/24","isPublic":false,"availabilityZone":"us-east-1a"}}},{"id":"node_ec2_1","type":"cloudNode","position":{"x":200,"y":530},"data":{"cloudType":"ec2","label":"Web Server 01","config":{"instanceType":"t3.medium","os":"Amazon Linux 2"}}},{"id":"node_ec2_2","type":"cloudNode","position":{"x":440,"y":530},"data":{"cloudType":"ec2","label":"Web Server 02","config":{"instanceType":"t3.medium","os":"Amazon Linux 2"}}},{"id":"node_rds","type":"cloudNode","position":{"x":320,"y":670},"data":{"cloudType":"rds","label":"PostgreSQL Multi-AZ","config":{"engine":"postgres","instanceClass":"db.t3.medium","multiAz":true,"publiclyAccessible":false}}},{"id":"node_s3","type":"cloudNode","position":{"x":600,"y":410},"data":{"cloudType":"s3","label":"Static Assets S3","config":{"versioning":true,"publicAccess":true,"encryption":true}}}]	2026-09-16T23:49:50.181249200Z	1.0
proj_aws-serverless	2026-09-16T23:49:50.194862700Z	Arquitectura escalable basada en funciones serverless Lambda, bucket S3 para almacenamiento y base de datos administrada.	[{"id":"e_srv_alb_lambda","source":"srv_alb","target":"srv_lambda","animated":true},{"id":"e_srv_lambda_s3","source":"srv_lambda","target":"srv_s3"},{"id":"e_srv_lambda_rds","source":"srv_lambda","target":"srv_rds"}]	AWS Serverless Event-Driven Stack	[{"id":"srv_alb","type":"cloudNode","position":{"x":300,"y":80},"data":{"cloudType":"alb","label":"API Gateway / ALB","config":{"scheme":"internet-facing"}}},{"id":"srv_lambda","type":"cloudNode","position":{"x":300,"y":220},"data":{"cloudType":"lambda","label":"API Processor Lambda","config":{"runtime":"nodejs20.x","memory":"512"}}},{"id":"srv_s3","type":"cloudNode","position":{"x":140,"y":360},"data":{"cloudType":"s3","label":"Media Storage Bucket","config":{"versioning":true,"publicAccess":true,"encryption":true}}},{"id":"srv_rds","type":"cloudNode","position":{"x":460,"y":360},"data":{"cloudType":"rds","label":"Serverless Aurora/RDS","config":{"engine":"postgres","instanceClass":"db.t3.micro","multiAz":false,"publiclyAccessible":false}}}]	2026-09-16T23:49:50.194862700Z	1.0
proj_azure-web	2026-09-16T23:49:50.202777200Z	Infraestructura empresarial en Microsoft Azure: VNet, Application Gateway WAF, Azure VM y base de datos Azure SQL gestionada.	[{"id":"e_az_vnet_sub","source":"az_vnet","target":"az_subnet"},{"id":"e_az_sub_appgw","source":"az_subnet","target":"az_appgw"},{"id":"e_az_appgw_vm","source":"az_appgw","target":"az_vm","animated":true},{"id":"e_az_vm_sql","source":"az_vm","target":"az_sql"},{"id":"e_az_vm_blob","source":"az_vm","target":"az_blob"}]	Azure Enterprise Web & SQL	[{"id":"az_vnet","type":"cloudNode","position":{"x":60,"y":60},"data":{"cloudType":"azure_vnet","label":"Hub VNet","config":{"addressSpace":"10.1.0.0/16"}}},{"id":"az_subnet","type":"cloudNode","position":{"x":320,"y":60},"data":{"cloudType":"azure_subnet","label":"Frontend Subnet","config":{"addressPrefix":"10.1.1.0/24","isPublic":true}}},{"id":"az_appgw","type":"cloudNode","position":{"x":320,"y":190},"data":{"cloudType":"azure_appgw","label":"App Gateway WAF_v2","config":{"sku":"WAF_v2"}}},{"id":"az_vm","type":"cloudNode","position":{"x":320,"y":330},"data":{"cloudType":"azure_vm","label":"App Service VM","config":{"size":"Standard_B2s","os":"Ubuntu 22.04 LTS"}}},{"id":"az_sql","type":"cloudNode","position":{"x":200,"y":470},"data":{"cloudType":"azure_sql","label":"Azure SQL Database","config":{"tier":"Standard_S1","zoneRedundant":true,"publicAccess":false}}},{"id":"az_blob","type":"cloudNode","position":{"x":440,"y":470},"data":{"cloudType":"azure_blob","label":"Secure Blob Storage","config":{"replication":"ZRS","publicBlobAccess":false,"versioning":true}}}]	2026-09-16T23:49:50.203297500Z	1.0
proj_gcp-cloud-native	2026-09-16T23:49:50.210809400Z	Topología nativa en Google Cloud Platform: VPC Network, Cloud Load Balancing, Compute Engine VM, Cloud SQL HA y Cloud Storage.	[{"id":"e_gcp_vpc_sub","source":"gcp_vpc_node","target":"gcp_sub_node"},{"id":"e_gcp_sub_lb","source":"gcp_sub_node","target":"gcp_lb_node"},{"id":"e_gcp_lb_gce","source":"gcp_lb_node","target":"gcp_gce_node","animated":true},{"id":"e_gcp_gce_sql","source":"gcp_gce_node","target":"gcp_sql_node"},{"id":"e_gcp_gce_gcs","source":"gcp_gce_node","target":"gcp_gcs_node"}]	GCP Cloud Native Stack	[{"id":"gcp_vpc_node","type":"cloudNode","position":{"x":60,"y":60},"data":{"cloudType":"gcp_vpc","label":"Main VPC Network","config":{"subnetMode":"custom"}}},{"id":"gcp_sub_node","type":"cloudNode","position":{"x":320,"y":60},"data":{"cloudType":"gcp_subnet","label":"Default Region Subnet","config":{"ipRange":"10.128.0.0/20","isPublic":false}}},{"id":"gcp_lb_node","type":"cloudNode","position":{"x":320,"y":190},"data":{"cloudType":"gcp_lb","label":"Cloud Load Balancer","config":{"tier":"PREMIUM"}}},{"id":"gcp_gce_node","type":"cloudNode","position":{"x":320,"y":330},"data":{"cloudType":"gcp_gce","label":"Backend Compute Engine","config":{"machineType":"e2-medium","os":"Debian 12"}}},{"id":"gcp_sql_node","type":"cloudNode","position":{"x":200,"y":470},"data":{"cloudType":"gcp_cloudsql","label":"Cloud SQL HA Postgres","config":{"databaseVersion":"POSTGRES_15","tier":"db-f1-micro","highAvailability":true,"publicIp":false}}},{"id":"gcp_gcs_node","type":"cloudNode","position":{"x":440,"y":470},"data":{"cloudType":"gcp_gcs","label":"GCS Standard Bucket","config":{"storageClass":"STANDARD","uniformAccess":true,"versioning":true}}}]	2026-09-16T23:49:50.210809400Z	1.0
proj_1789604249027_5mgd78iv9	2026-09-17T00:17:29.049836900Z	Prueba	[{"style":{"stroke":"#475569","strokeWidth":1.5},"markerEnd":{"type":"arrowclosed","color":"#475569"},"source":"node_1789606230644","sourceHandle":null,"target":"node_1789606232827","targetHandle":null,"animated":false,"id":"reactflow__edge-node_1789606230644-node_1789606232827"}]	Azure	[{"id":"node_1789606230644","type":"cloudNode","position":{"x":325.4,"y":127.6},"data":{"cloudType":"block","label":"BLOCK","config":{"notes":"Architecture Block"}},"width":156,"height":53,"selected":false,"positionAbsolute":{"x":325.4,"y":127.6},"dragging":false},{"id":"node_1789606232827","type":"cloudNode","position":{"x":324.2000000000001,"y":261.8999999999999},"data":{"cloudType":"icon","label":"ICON","config":{}},"width":156,"height":53,"selected":false,"positionAbsolute":{"x":324.2000000000001,"y":261.8999999999999},"dragging":false}]	2026-09-17T00:50:40.537003700Z	1.0
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, created_at, email, first_name, last_name, password, region) FROM stdin;
user_08b3a9ea4c93	2026-09-17T00:14:09.680723300Z	juan.perez@example.com	Juan	Perez	Password123!	US1
user_e1d0c772a4b4	2026-09-17T00:16:00.066171700Z	razself@gmail.com	Stevie	Marca	123456	US1
\.


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: users uk6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict AJdE00c3vIetM0dOJRKMpH5cdwYpimgLTfHQCOSGPlZP2pW7xxayVKzhBxjFrT7

