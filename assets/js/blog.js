const authorName = document.getElementById("blogAuthor");
const titleField = document.getElementById("blogTitle");
const contentField = document.getElementById("blogContent");
const submitBtn = document.getElementById("submitBlogBtn");

// Initialize SimpleMDE
const simplemde = new SimpleMDE({
    element: contentField,
    forceSync: true,
});

// Check authentication state change
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        authorName.value = user.email.split("@")[0];
    } else {
        window.location.href = "auth.html";
    }
});

// Event listener for the submit button
submitBtn.addEventListener("click", function () {
    const blogTitle = titleField.value;
    const blogAuthor = authorName.value;
    const blogContent = simplemde.value();
    const imageUrl = "https://mustard-nu.vercel.app/assets/images/events/image_08.jpg";

    if (blogTitle && blogAuthor && blogContent.length > 90) {
        db.collection("blogPosts").add({
            title: blogTitle,
            author: blogAuthor,
            content: blogContent,
            date: firebase.firestore.Timestamp.fromDate(new Date()),
            image: imageUrl
        }).then(function () {
            alert("Blog post created successfully!");
        }).catch(function () {
            alert("Failed to create blog post.");
        });
    } else {
        alert("Please fill in all fields and ensure the blog content is more than 90 characters.");
    }
});