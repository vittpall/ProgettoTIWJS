(() => {
    let pageOrchestrator;

    window.addEventListener("load", () => {
        if (sessionStorage.getItem("username") === null) {
            window.location.href = "login.html"; // Redirect to login if not logged in
        } else {
            pageOrchestrator = new PageOrchestrator();
            pageOrchestrator.start(); // Initialize the components
            pageOrchestrator.refresh();
        }
    }, false);

    function ImageDetails(containerId) {
        this.container = document.getElementById(containerId);

        this.registerEvents = () => {
            let form = this.container.querySelector('form');
            if (form) {
                form.addEventListener('submit', this.submitComment);
            }
        };

        this.show = (imageId) => {
            makeCall("GET", `/api/imageDetails?imageId=${imageId}`, null, (req) => {
                if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
                    const data = JSON.parse(req.responseText);
                    this.update(data);
                    this.container.style.display = 'block'; // Show modal with image details
                } else {
                    console.error('Failed to fetch image details:', req.statusText);
                    alert('Failed to load image details.');
                }
            });
        };

        this.update = (data) => {
            const imageHtml = `<div>
                <img src="${data.path}" alt="${data.title}" style="max-width: 100%;">
                <p>${data.description}</p>
                <p>Comments: ${data.comments.join(", ")}</p>
                <form id="commentForm">
                    <textarea name="comment" placeholder="Add a comment"></textarea>
                    <button type="submit">Submit</button>
                </form>
            </div>`;
            this.container.innerHTML = imageHtml;
            this.registerEvents(); // Register events after HTML update
        };

        this.submitComment = (e) => {
            e.preventDefault();
            const comment = e.target.querySelector('textarea[name="comment"]').value.trim();
            if (comment.length === 0) {
                alert("Comment cannot be empty.");
                return;
            }
            // Implement the AJAX call to POST the comment to the server
        };
    }

    function AlbumCreator(formId) {
        this.form = document.getElementById(formId);

        this.registerEvents = () => {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(this.form);
                makeCall("POST", '/api/createAlbum', formData, (req) => {
                    if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
                        alert('Album created successfully');
                        pageOrchestrator.refresh(); // Refresh to show the new album
                    } else {
                        console.error('Error creating album:', req.statusText);
                    }
                });
            });
        };

        this.registerEvents(); // Auto-register events on instantiation
    }

    function AlbumList(userAlbumsContainerId, otherAlbumsContainerId) {
        this.userAlbumsContainer = document.getElementById(userAlbumsContainerId);
        this.otherAlbumsContainer = document.getElementById(otherAlbumsContainerId);

        this.loadAlbums = () => {
            makeCall("GET", '/api/albums', null, (req) => {
                if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
                    const albums = JSON.parse(req.responseText);
                    this.displayAlbums(albums.user, this.userAlbumsContainer);
                    this.displayAlbums(albums.other, this.otherAlbumsContainer);
                } else {
                    console.error('Failed to load albums:', req.statusText);
                }
            });
        };

        this.displayAlbums = (albums, container) => {
            container.innerHTML = ''; // Clear previous content
            albums.forEach(album => {
                let div = document.createElement('div');
                div.textContent = album.title;
                div.dataset.albumId = album.id;
                container.appendChild(div);
            });
            this.makeSortable(container); // Add sortable functionality
        };

        this.makeSortable = (container) => {
            new Sortable(container, {
                animation: 150,
                store: {
                    set: (sortable) => {
                        let order = sortable.toArray();
                        console.log(order); // Log the new order
                        this.saveOrder(order);
                    }
                }
            });
        };

        this.saveOrder = (order) => {
            makeCall("POST", '/api/saveAlbumOrder', JSON.stringify({order}), (req) => {
                if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
                    alert('Order saved successfully');
                } else {
                    alert('Failed to save order');
                }
            });
        };

        this.loadAlbums(); // Load albums immediately on instantiation
    }

    function PageOrchestrator() {
        this.start = () => {
            new AlbumCreator('createAlbumForm');
            new ImageDetails('imageDetailsSection');
            new AlbumList('userAlbums', 'otherUserAlbums');
        };

        this.refresh = () => {
            // Placeholder to refresh components if needed
        };
    }

    function makeCall(method, url, formElement, cback, reset = true) {
        let req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if (req.readyState === XMLHttpRequest.DONE) {
                cback(req);
            }
        };
        req.open(method, url);
        if (formElement === null) {
            req.send();
        } else {
            req.send(new FormData(formElement));
        }
        if (formElement !== null && reset) {
            formElement.reset(); // Reset the form if required
        }
    }
})();
