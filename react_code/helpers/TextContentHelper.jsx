import React              from 'react';

export default class TextContentHelper {
  constructor(paragraph_collection=[], translation_array=[]) {
    this.paragraph_collection = paragraph_collection;
    this.translation_array = translation_array;
  }

  paragraphs_to_str(paragraph_collection) {
    let paragraphs = paragraph_collection || this.paragraph_collection;
    let translation_array = [] || this.translation_array;

    var paragraph_array = paragraphs.map((paragraph, index) => {
      var sent_array = paragraph.sentences.map((sentence)=> {
        sentence.words.map((word)=>{
          if(word.default_translation != null){ translation_array[word.content] = word.default_translation.content; }
        });
        return sentence.sentence;
      });
      return sent_array.join(" ");
    });

    return({content: paragraph_array.join("\n\n"), translation_array: translation_array});
  }
}
