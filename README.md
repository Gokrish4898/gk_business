# gk_business

// build command for Angular :- 
 ng build --base-href https://gokrish4898.github.io/gk_business/

// Deploy in Page Github: 
 npx angular-cli-ghpages --dir=dist/gkb-ui/browser


## 🚀 Local Development Cheat Sheet

This project can be run locally using either pure Docker or a local Kubernetes cluster. 

### 🐳 Option 1: Run with Docker (Fastest)

Use these commands to run the API directly via Docker Engine.

| Action | Command | Description |
| :--- | :--- | :--- |
| **Build Image** | `docker build -t snapdough-api:v1 .` | Compiles the code and creates the Docker image. |
| **Run API** | `docker run -d -p 8080:8080 --name my-api snapdough-api:v1` | Runs the container in the background on port 8080. |
| **View Logs** | `docker logs my-api` | Prints the console output from the running container. |
| **Stop API** | `docker stop my-api` | Gracefully shuts down the running container. |
| **Clean Up** | `docker rm my-api` | Deletes the stopped container so you can start fresh. |

> **Access the API:** Once running, navigate to [http://localhost:8080/swagger](http://localhost:8080/swagger)

---

### ☸️ Option 2: Run with Kubernetes

Ensure your local Kubernetes cluster (e.g., Docker Desktop or Minikube) is running before executing these commands.

| Action | Command | Description |
| :--- | :--- | :--- |
| **Deploy App** | `kubectl apply -f deployment.yaml`<br>`kubectl apply -f service.yaml` | Creates the worker pods and opens the network service. |
| **Check Status**| `kubectl get pods`<br>`kubectl get svc` | Verifies that the pods are `Running` and the port is mapped. |
| **Apply Updates**| `kubectl rollout restart deployment api-deployment` | Forces K8s to pull your newest Docker image after a rebuild. |
| **Teardown** | `kubectl delete -f deployment.yaml`<br>`kubectl delete -f service.yaml` | Safely removes the specific deployment and service. |

---

### 🧹 System Cleanup (The "Nukes")

Use these commands if the environment gets stuck and you need a 100% clean slate. *Warning: Use with caution.*

| Action | Command | Description |
| :--- | :--- | :--- |
| **Reset K8s** | `kubectl delete all --all` | Deletes **all** Kubernetes resources in the current workspace. |
| **Reset Docker**| `docker system prune -a --volumes --force` | Deep cleans all unused Docker images, containers, and caches. |
