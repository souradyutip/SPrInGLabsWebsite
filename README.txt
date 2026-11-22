SPrInG Labs - static website
============================
Plain HTML/CSS/JS export of the React site (SPRINGLabs-master). No build step,
no Node.js, no server rewrites needed.

Open index.html in a browser, or upload this whole folder to any web server
(works at the domain root or in a sub-folder).

  *.html        one file per page (index, resources, products, news-events,
                contact, people (current members + alumni), project-1..5, 404,
                publications)
  css/style.css all styling (compiled Tailwind)
  js/site.js    menus, "Apply Now" dialog, project search, news "Read More"
  assets/       logos used by the pages
  people/ news/ projects/   images

To change text, edit the relevant .html file directly. Note that the navbar
and footer are repeated in every page.
