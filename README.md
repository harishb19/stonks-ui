# Stonks

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Steps to run the project
1. If you want to connect your local graphql sever <br/> 
   go to `App.js` and replace `GRAPH_URL` and `WSS_URL` with local graphql endpoints<br>
    ```
    const httpLink = new HttpLink({
        uri: GRAPH_URL,
    });
    const wsLink = new GraphQLWsLink(createClient({
        url: WSS_URL,
    }))
   ```
    
2. Run `yarn install` (necessary)
3. Run `yarn start`

### Hosting:
You can directly visit stonks by going on
https://stonks-harishb19.vercel.app/

**_NOTE:_**  You may skip step 1 and directly start with step 2
