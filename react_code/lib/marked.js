import marked from 'marked';

let renderer = new marked.Renderer();

// Override paragraph rendering
renderer.paragraph = function(text) {
  return '<p class="ce-marked">' + text + '</p>\n';
};

marked.setOptions({
  renderer: renderer,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

marked.Renderer

export default marked;
