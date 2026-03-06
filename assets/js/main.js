// ============================================================
// AUTOTEK — main.js
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

  // ---- Mobile Nav Toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
      });
    });
  }

  // ---- Blog: Load posts from data/posts.json ----
  const blogGrid = document.getElementById('blogGrid');
  const blogPreview = document.getElementById('blogPreview');

  function createBlogCard(post, expanded) {
    var card = document.createElement('div');
    card.className = 'blog-card';
    card.setAttribute('data-category', post.category);

    var catClass = 'badge-blue';
    if (post.category === 'EV Diagnostics') catClass = 'badge-green';
    if (post.category === 'Tips & Tricks') catClass = 'badge-red';

    var dateStr = new Date(post.date).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

    var html = '<span class="badge ' + catClass + '">' + post.category + '</span>';
    html += '<h3>' + post.title + '</h3>';
    html += '<div class="blog-meta"><span>' + dateStr + '</span><span>By ' + post.author + '</span></div>';
    html += '<p class="blog-excerpt">' + post.excerpt + '</p>';

    if (expanded && post.content) {
      html += '<div class="blog-content" id="content-' + post.id + '">';
      var paragraphs = post.content.split('\n\n');
      for (var i = 0; i < paragraphs.length; i++) {
        html += '<p>' + paragraphs[i] + '</p>';
      }
      html += '</div>';
      html += '<button class="read-more" onclick="togglePost(' + post.id + ')">Read More →</button>';
    }

    card.innerHTML = html;
    return card;
  }

  function loadPosts() {
    fetch('data/posts.json')
      .then(function(res) { return res.json(); })
      .then(function(posts) {
        // Sort by date descending
        posts.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });

        // Blog preview (homepage — show 3)
        if (blogPreview) {
          blogPreview.innerHTML = '';
          var previewPosts = posts.slice(0, 3);
          previewPosts.forEach(function(post) {
            blogPreview.appendChild(createBlogCard(post, false));
          });
        }

        // Full blog page
        if (blogGrid) {
          blogGrid.innerHTML = '';
          window._allPosts = posts;
          posts.forEach(function(post) {
            blogGrid.appendChild(createBlogCard(post, true));
          });
        }
      })
      .catch(function(err) {
        console.error('Error loading posts:', err);
        if (blogGrid) blogGrid.innerHTML = '<p class="blog-loading">Unable to load posts.</p>';
        if (blogPreview) blogPreview.innerHTML = '<p class="blog-loading">Unable to load posts.</p>';
      });
  }

  if (blogGrid || blogPreview) {
    loadPosts();
  }

  // ---- Blog Filters ----
  var filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      var cards = blogGrid.querySelectorAll('.blog-card');
      cards.forEach(function(card) {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ---- Contact Form: Formspree handling ----
  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var formData = new FormData(contactForm);
      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function(res) {
        if (res.ok) {
          contactForm.style.display = 'none';
          if (formSuccess) formSuccess.style.display = 'block';
        } else {
          alert('There was an error sending your message. Please call us at 314-922-3083.');
        }
      }).catch(function() {
        alert('There was an error sending your message. Please call us at 314-922-3083.');
      });
    });
  }

});

// ---- Toggle blog post content ----
function togglePost(id) {
  var content = document.getElementById('content-' + id);
  if (!content) return;
  var btn = content.nextElementSibling;
  if (content.classList.contains('expanded')) {
    content.classList.remove('expanded');
    if (btn) btn.textContent = 'Read More →';
  } else {
    content.classList.add('expanded');
    if (btn) btn.textContent = '← Read Less';
  }
}
