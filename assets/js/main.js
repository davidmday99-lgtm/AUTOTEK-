// AUTOTEK main.js

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function() {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function() {
      links.classList.toggle('open');
    });
    // Close on link click
    links.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() { links.classList.remove('open'); });
    });
  }

  // Active nav highlighting
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    var href = a.getAttribute('href');
    if (href === currentPage) a.classList.add('active');
  });

  // Blog preview (homepage)
  var blogPreview = document.getElementById('blogPreview');
  if (blogPreview) {
    loadBlogPosts('data/posts.json', function(posts) {
      if (!posts || posts.length === 0) {
        blogPreview.innerHTML = '<p class="blog-loading">No posts yet. Check back soon!</p>';
        return;
      }
      var recent = posts.slice(0, 3);
      blogPreview.innerHTML = recent.map(function(p) {
        return renderBlogCard(p);
      }).join('');
    });
  }

  // Blog page full listing
  var blogGrid = document.getElementById('blogGrid');
  var blogFilters = document.getElementById('blogFilters');
  var blogSearch = document.getElementById('blogSearch');
  var allPosts = [];

  if (blogGrid && blogFilters) {
    loadBlogPosts('data/posts.json', function(posts) {
      allPosts = posts || [];
      renderBlogGrid(allPosts);

      // Category filters
      blogFilters.querySelectorAll('.blog-filter').forEach(function(btn) {
        btn.addEventListener('click', function() {
          blogFilters.querySelectorAll('.blog-filter').forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          filterAndRender();
        });
      });

      // Search
      if (blogSearch) {
        blogSearch.addEventListener('input', function() { filterAndRender(); });
      }
    });
  }

  function filterAndRender() {
    var activeFilter = document.querySelector('.blog-filter.active');
    var category = activeFilter ? activeFilter.getAttribute('data-category') : 'all';
    var query = blogSearch ? blogSearch.value.toLowerCase() : '';
    var filtered = allPosts.filter(function(p) {
      var matchCat = category === 'all' || p.category === category;
      var matchSearch = !query || p.title.toLowerCase().indexOf(query) !== -1 || p.excerpt.toLowerCase().indexOf(query) !== -1;
      return matchCat && matchSearch;
    });
    renderBlogGrid(filtered);
  }

  function renderBlogGrid(posts) {
    if (!blogGrid) return;
    if (posts.length === 0) {
      blogGrid.innerHTML = '<p class="blog-loading">No posts found.</p>';
      return;
    }
    blogGrid.innerHTML = posts.map(function(p) { return renderBlogCard(p, true); }).join('');
    // Attach read more handlers
    blogGrid.querySelectorAll('.read-more').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = btn.getAttribute('data-id');
        var content = document.getElementById('content-' + id);
        if (content) {
          content.classList.toggle('show');
          btn.textContent = content.classList.contains('show') ? 'Read Less' : 'Read More \u2192';
        }
      });
    });
  }

  // Contact form success
  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var data = new FormData(contactForm);
      fetch(contactForm.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function(r) {
          if (r.ok) {
            contactForm.style.display = 'none';
            if (formSuccess) formSuccess.classList.add('show');
          } else {
            alert('Something went wrong. Please call us at 314-922-3083.');
          }
        })
        .catch(function() {
          alert('Something went wrong. Please call us at 314-922-3083.');
        });
    });
  }
});

function loadBlogPosts(url, callback) {
  fetch(url)
    .then(function(r) { return r.json(); })
    .then(callback)
    .catch(function() { callback([]); });
}

function renderBlogCard(post, full) {
  var date = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  var badgeClass = 'badge-blue';
  if (post.category === 'EV Diagnostics') badgeClass = 'badge-red';
  if (post.category === 'Tips & Tricks') badgeClass = 'badge-green';

  var html = '<div class="blog-card">';
  html += '<div class="blog-card-body">';
  html += '<span class="badge ' + badgeClass + '">' + post.category + '</span>';
  html += '<h3><a href="blog.html">' + post.title + '</a></h3>';
  html += '<div class="blog-meta"><span>' + date + '</span><span>By ' + post.author + '</span></div>';
  html += '<p class="blog-excerpt">' + post.excerpt + '</p>';
  if (full) {
    html += '<button class="read-more" data-id="' + post.id + '">Read More \u2192</button>';
  }
  html += '</div>';
  if (full && post.content) {
    html += '<div class="blog-content" id="content-' + post.id + '">';
    var paragraphs = post.content.split('\n\n');
    for (var i = 0; i < paragraphs.length; i++) {
      html += '<p>' + paragraphs[i] + '</p>';
    }
    html += '</div>';
  }
  html += '</div>';
  return html;
}