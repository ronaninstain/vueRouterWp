jQuery(document).ready(function ($) {
    console.log("Submenu redirect script loaded"); // Debugging line
    $('a[href="admin.php?page=wp-vue-course-control"]').on("click", function (e) {
      e.preventDefault(); // Prevent default link behavior
      window.location.href = "admin.php?page=wp-vue-admin#/course"; // Redirect to the Vue route
    });
  });
  