# gk_business

// build command for Angular :- 
 ng build --base-href https://gokrish4898.github.io/gk_business/

// Deploy in Page Github: 
 npx angular-cli-ghpages --dir=dist/gkb-ui/browser


// docker Command,What it does,

When to use it
docker build -t snapdough-api:v1 . -- //Builds your Docker image based on the instructions in your Dockerfile.,Every time you change your C# code and need a fresh image.
docker run -d -p 8080:8080 --name my-api snapdough-api:v1 -- // "Runs your image as a container in the background, mapping port 8080.",When you want to run the API directly without using Kubernetes.
docker ps -- // Lists all containers that are currently running, To check if your container is active and what port it is using.
docker logs my-api -- // Prints the console output from your running container.,When the container crashes or you want to see the application's startup messages.
docker stop my-api -- // Gracefully shuts down your running container.,When you are done working for the day or need to restart it.
docker rm my-api -- //Deletes the stopped container from Docker.,To clean up old containers so you can reuse the name my-api.
