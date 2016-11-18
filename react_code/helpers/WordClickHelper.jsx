import React              from 'react';
import { escapeRegExp }   from '../lib/AppUtils';
import { OverlayTrigger, Popover }     from 'react-bootstrap';
import Word               from '../components/Word';

export default class WordClickHelper {
  constructor(activity, preferred_lang='en', is_hybrid=false, wordClickCb) {
    this.activity = activity;
    this.wordClickCallback = wordClickCb;
    this.preferred_lang = preferred_lang;
    this.translation_array = [];
    this.is_hybrid = is_hybrid;
    this.is_clickable = false;
  }

  decorateText(text, translation_array=[], is_clickable=false) {
    let focalWords = [];
    let textSegments = text.match(/<\w[^>]*>([\s\S]*?)<\/\w>/g);
    this.translation_array = translation_array;
    this.is_clickable = is_clickable;
    switch(this.activity.type) {
      case 'MatrixActivity':
        this.activity.matrix_rows.forEach((r) => {
          r.matrix_questions.forEach((q) => {
            focalWords.push(...q.words);
          });
        });
        break;
      case 'FindAndClickActivity':
        focalWords = this.activity.question.words;
        break;
      default:
        break;
    }

    if(textSegments) {
      return textSegments.map((segment, seg_index) => {
        let [_, startTag, innerText, endTag] = segment.match(/(<\w[^>]*>)([\s\S]*?)(<\/\w>)/);

        return (
          <p key={`seg-${seg_index}`} className="ce-marked">
            {this.doDecorateText(innerText, focalWords)}
          </p>
        );
      });
    } else {
      return this.doDecorateText(text, focalWords);
    }
  }

  doDecorateText(text, focalWords) {
    let activity = this.activity;
    let selectedWords = [];
    let wordLookup = {};

    switch(activity.type) {
      case 'MatrixActivity':
        for(let k in activity.matrixWords) {
          selectedWords.push(...activity.matrixWords[k]);
        }
        break;
      case 'FindAndClickActivity':
        selectedWords.push(...(activity.selectedWords || []));
        break;
    }

    // Sort the focalWords collection by word length (DESC); this
    // ensures that phrases (that might include other focalWords)
    // are matched first.
    focalWords = focalWords.sort((a, b) => b.content.length - a.content.length);

    for(let i = 0, l = focalWords.length; i < l; i++) {
      let criterium = escapeRegExp(focalWords[i].content);
      let regexp = new RegExp(`${criterium}(\\W|$)`, 'gi');

      text = text.replace(/&#39;/, "'");
      text = text.replace(regexp, (a, b) => {
        if(!wordLookup[i]) {
          wordLookup[i] = []
        }

        let len = wordLookup[i].length;

        // Initial regex includes an extra non-word character;
        // this is how we prevent matching 'differently' when
        // searching for 'different'. Now, we segment the
        // focal word from the non-word character so that we
        // can both decorate just the focal word and preserve
        // the syntax of the text.
        let re = new RegExp(`(${criterium})(\\W|$)`, 'i');
        let match = a.match(re);

        wordLookup[i][len] = match[1];

        // We encode both the word identifier (i) and
        // the occurrence identifier (len) in this
        // interpolation syntax. This allows us to perform
        // an occurrence-specific lookup and maintain
        // word/phrase casing.
        return `@(${i}:::${len})${match[2]}`;
      });
    }

    return text.split(/\s/).map((w, word_index) => {
      let focalMatch = w.match(/(.*)@\((\d+:::\d+)\)(.*)/);
      let word = w.replace(/&#39;/g, "\'").replace(/&amp;/g, "&").replace(/&quot;/g, '\"');

      if(focalMatch) {
        let [lookup, occurrence] = focalMatch[2].split(':::');
        word = wordLookup[lookup][occurrence];
      }
      let innerText = `${word}`;

      //If we need to add hover translations
      if(this.is_hybrid && Object.keys(this.translation_array).length){
        var words = word.split(" ");
        innerText = words.map((_word, i)=>{
          let translation = this.translation_array[_word.replace(/[ \.,?!;'")(*&@:%]$/g, "")];
          return (<Word word={_word} translation={translation} key={`word-${i}`} />);
        })
      }

      //word = word.replace(/[\.,?!]/, "");
      let className =  `ce-word ${word.replace(/[ \.,?!;'")(*&@:%]/g, "_")}`;
      let before = focalMatch && focalMatch[1] ? (<span>{focalMatch[1].replace(/&#39;/g, "\'").replace(/&amp;/g, "&").replace(/&quot;/g, '\"')}</span>) : '';
      let after = focalMatch && focalMatch[3] ? (<span>{focalMatch[3].replace(/&#39;/g, "\'").replace(/&amp;/g, "&").replace(/&quot;/g, '\"') + ' '}</span>) : ' ';
      if(this.is_clickable){
        return (
          <span key={`${word.replace(/[ \.,?!;'")(*&@:%]/g, "_")}-${word_index}`}>
            {before}
            <span onClick={(e) => this.handleWordClick(e, word)} className={className}>
              {innerText}
            </span>
            {after}
          </span>
        );
      } else{
        className = `${word.replace(/[ \.,?!;'")(*&@:%]/g, "_")}`;
        return (
          <span key={`${word.replace(/[ \.,?!;'")(*&@:%]/g, "_")}-${word_index}`}>
            {before}
            <span className={className}>
              {innerText}
            </span>
            {after}
          </span>
        );
      }
    });
  }

  handleWordClick(e, word) {
    if(this.preferred_lang == "en"){
      this.wordClickCallback(e, word);
    }
  }
}
