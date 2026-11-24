SPrInG Labs - static website
============================
Plain HTML/CSS/JS export of the React site (SPRINGLabs-master). No build step,
no Node.js, no server rewrites needed.

Open index.html in a browser, or upload this whole folder to any web server
(works at the domain root or in a sub-folder).

  index.html    the whole site as one scrolling page. Each section is a block
                <div data-page="NAME" id="NAME"> ... </div>, reached at index.html#NAME:
                home, projects, resources, people, publications, products,
                news-events, contact. project-1 .. project-5 are detail pages
                that replace the scrolling page while open.
  404.html      "page not found" page (kept separate; web servers need it)
  css/style.css base styling (compiled Tailwind; do not edit by hand)
  css/theme.css the site's look: fonts, colours, hero, section headers,
                cards, publication timeline, contact band, footer
  js/site.js    section scrolling/highlighting, menus, "Apply Now" dialog,
                news "Read More"
  assets/       logos used by the pages
  people/ news/ projects/   images

To change text, edit the matching <div data-page="..."> block in index.html.
To link to a section, use href="#NAME" (e.g. href="#people"); a link to any id
(e.g. href="#alumni") scrolls to it.
