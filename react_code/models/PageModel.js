export default class PageModel {
  constructor(page) {
      this.id = page.id;
      this.activities = page.activities || [],
      this.content_elements = page.content_elements || [];
      this.next_page_id = page.next_page_id || null;
  }

  asJSON() {
    return {
      id: this.id;
      activities: this.activities || [],
      content_elements: this.content_elements || [];
    };
  }

  isValid() {
    throw 'Not implemented!';
  }
}
