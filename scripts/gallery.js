document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.getElementById('gallery-grid');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const categories = document.querySelectorAll('.gallery-category');
    
    // Sample gallery items (you would typically load these from a database)
    const galleryItems = [
        { src: '/api/placeholder/600/400', alt: 'Presidential Suite', category: 'rooms' },
        { src: '/api/placeholder/600/400', alt: 'Swimming Pool', category: 'amenities' },
        { src: '/api/placeholder/600/400', alt: 'Family Suite', category: 'rooms' },
        { src: '/api/placeholder/600/400', alt: 'Galeshewe Sunset', category: 'surroundings' },
        { src: '/api/placeholder/600/400', alt: 'Restaurant', category: 'dining' },
        { src: '/api/placeholder/600/400', alt: 'Conference Room', category: 'events' },
        // Add more items as needed
    ];

    function loadGalleryItems() {
        galleryItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.dataset.category = item.category;
            div.innerHTML = `
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E" 
                     data-src="${item.src}" 
                     alt="${item.alt}" 
                     loading="lazy">
                <div class="gallery-caption">${item.alt}</div>
            `;
            galleryGrid.appendChild(div);
        });

        lazyLoad();
    }

    function lazyLoad() {
        const images = document.querySelectorAll('.gallery-item img');
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, options);

        images.forEach(img => observer.observe(img));
    }

    function filterGallery(category) {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    categories.forEach(categoryBtn => {
        categoryBtn.addEventListener('click', function() {
            categories.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            filterGallery(this.dataset.category);
        });
    });



    

            galleryGrid.addEventListener('click', function(e) {
                if (e.target.tagName === 'IMG') {
                    lightboxImg.src = e.target.src;
                    lightbox.style.display = 'block';
                }
            });

            lightbox.addEventListener('click', function() {
                this.style.display = 'none';
            });

            loadGalleryItems();
        });

        document.addEventListener('DOMContentLoaded', function() {
            const categories = document.querySelectorAll('.gallery-category');
            const items = document.querySelectorAll('.gallery-item');

            categories.forEach(category => {
                category.addEventListener('click', function() {
                    const selectedCategory = this.dataset.category;

                    categories.forEach(cat => cat.classList.remove('active'));
                    this.classList.add('active');

                    items.forEach(item => {
                        if (selectedCategory === 'all' || item.dataset.category === selectedCategory) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            });
        });