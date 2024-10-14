// Define the components for the tabs

const offerForms = {
  template: `
    <div class="p-6 bg-white rounded-lg">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">Offer Form</h2>
      <form @submit.prevent="saveOptions" class="mb-4">
        <div class="mb-4">
          <label class="block mb-2 text-sm font-medium text-gray-700">Title:</label>
          <input
            type="text"
            v-model="newTitle"
            class="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter title"
            required
          />
          <button
            type="button"
            @click="addTitle"
            class="bg-green-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-green-600 transition duration-200"
          >
            Add Title
          </button>
        </div>
        
        <div class="mb-4">
          <label class="block mb-2 text-sm font-medium text-gray-700">Upload Image:</label>
          <input type="hidden" id="my_image_url" v-model="imageUrl" />
          <input
            type="button"
            @click="uploadImage"
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            value="Upload Image"
          />
          <img v-if="imageUrl" :src="imageUrl" class="max-w-xs mt-2 border rounded-md shadow-sm" />
          <button
            type="button"
            @click="addImage"
            class="bg-green-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-green-600 transition duration-200"
          >
            Add Image
          </button>
        </div>

        <h3 class="text-lg font-semibold text-gray-800 mt-6">Added Titles:</h3>
        <ul class="list-disc list-inside mb-4">
          <li v-for="(title, index) in titles" :key="index" class="text-gray-700">{{ title }}</li>
        </ul>

        <h3 class="text-lg font-semibold text-gray-800">Added Images:</h3>
        <ul class="grid grid-cols-2 gap-2 mb-4">
          <li v-for="(image, index) in images" :key="index">
            <img :src="image" class="max-w-full h-auto border rounded-md shadow-sm" />
          </li>
        </ul>
      </form>
    </div>
  `,
  data() {
    return {
      newTitle: "", // Single title input
      titles: [], // Array to hold multiple titles
      imageUrl: "", // Single image URL
      images: [], // Array to hold multiple image URLs
    };
  },
  methods: {
    uploadImage() {
      if (typeof wp === "undefined" || typeof wp.media === "undefined") {
        console.error("WordPress media uploader not available.");
        return;
      }

      let mediaUploader;
      const self = this;
      if (mediaUploader) {
        mediaUploader.open();
        return;
      }

      mediaUploader = wp.media.frames.file_frame = wp.media({
        title: "Choose Image",
        button: {
          text: "Choose Image",
        },
        multiple: false,
      });

      mediaUploader.on("select", function () {
        var attachment = mediaUploader
          .state()
          .get("selection")
          .first()
          .toJSON();
        self.imageUrl = attachment.url; // Store selected image URL
      });

      mediaUploader.open();
    },
    addTitle() {
      if (this.newTitle.trim() !== "") {
        this.titles.push(this.newTitle); // Add title to array
        this.saveOption("title", this.newTitle); // Save title to the database
        this.newTitle = ""; // Clear input field
      }
    },
    addImage() {
      if (this.imageUrl) {
        this.images.push(this.imageUrl); // Add image to array
        this.saveOption("image_url", this.imageUrl); // Save image URL to the database
        this.imageUrl = ""; // Clear image after adding
      }
    },
    saveOption(key, value) {
      // Prepare the data to save
      const data = {};
      data[key] = value; // Only include the current value

      // Make the API request to save the new option
      fetch(`${wpApiSettings.root}wp/v2/my_options`, {
        method: "POST",
        headers: {
          "X-WP-Nonce": wpApiSettings.nonce,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Option saved:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  },
};

const BlogTitles = {
  template: `<div class="p-4">
        <h2 class="text-2xl font-bold mb-4">Blog Titles</h2>
        <ul class="list-disc ml-5 space-y-2">
          <li v-for="post in posts" :key="post.id" class="text-lg text-gray-700 hover:text-blue-600 cursor-pointer">
            {{ post.title.rendered }}
          </li>
        </ul>
      </div>
    `,
  data() {
    return {
      posts: [],
    };
  },
  created() {
    // Fetch the blog posts when the component is created
    fetch(`${wpApiSettings.root}wp/v2/posts`, {
      method: "GET",
      headers: {
        "X-WP-Nonce": wpApiSettings.nonce,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.posts = data;
      });
  },
};

const BlogContents = {
  template: `
      <div class="p-4">
        <h2 class="text-2xl font-bold mb-4">Blog Contents</h2>
        <div v-for="post in posts" :key="post.id" class="mb-6 border-b pb-4">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ post.title.rendered }}</h3>
          <div class="text-gray-700 leading-relaxed" v-html="post.content.rendered"></div>
        </div>
      </div>
    `,
  data() {
    return {
      posts: [],
    };
  },
  created() {
    // Fetch the blog posts when the component is created
    fetch(`${wpApiSettings.root}wp/v2/posts`, {
      method: "GET",
      headers: {
        "X-WP-Nonce": wpApiSettings.nonce,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.posts = data;
      });
  },
};

// Define the Course Control component
const CourseControl = {
  template: `<div>Hello from course control centre</div>`,
};

// Define the routes
const routes = [
  { path: "/", component: BlogTitles },
  { path: "/contents", component: BlogContents },
  { path: "/offerForm", component: offerForms },
  { path: '/course-control', component: CourseControl }
];

// Create the Vue Router instance
const router = new VueRouter({
  mode: "hash",
  routes, // short for `routes: routes`
});

// Create the main Vue instance
new Vue({
  el: "#divWpVue",
  router, // Pass the router instance to the Vue instance
});
