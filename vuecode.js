// Define the components for the tabs
const BlogTitles = {
    template: `
      <div>
        <h2>Blog Titles</h2>
        <ul>
          <li v-for="post in posts" :key="post.id">
            {{ post.title.rendered }}
          </li>
        </ul>
      </div>
    `,
    data() {
      return {
        posts: []
      };
    },
    created() {
      // Fetch the blog posts when the component is created
      fetch(`${wpApiSettings.root}wp/v2/posts`, {
        method: 'GET',
        headers: {
          'X-WP-Nonce': wpApiSettings.nonce
        }
      })
      .then(response => response.json())
      .then(data => {
        this.posts = data;
      });
    }
  };
  
  const BlogContents = {
    template: `
      <div>
        <h2>Blog Contents</h2>
        <div v-for="post in posts" :key="post.id">
          <h3>{{ post.title.rendered }}</h3>
          <div v-html="post.content.rendered"></div>
        </div>
      </div>
    `,
    data() {
      return {
        posts: []
      };
    },
    created() {
      // Fetch the blog posts when the component is created
      fetch(`${wpApiSettings.root}wp/v2/posts`, {
        method: 'GET',
        headers: {
          'X-WP-Nonce': wpApiSettings.nonce
        }
      })
      .then(response => response.json())
      .then(data => {
        this.posts = data;
      });
    }
  };
  
  // Define the routes
  const routes = [
    { path: '/', component: BlogTitles },
    { path: '/contents', component: BlogContents }
  ];
  
  // Create the Vue Router instance
  const router = new VueRouter({
    routes // short for `routes: routes`
  });
  
  // Create the main Vue instance
  new Vue({
    el: '#divWpVue',
    router // Pass the router instance to the Vue instance
  });
  