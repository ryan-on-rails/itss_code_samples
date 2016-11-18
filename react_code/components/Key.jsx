import React, { PropTypes }   from 'react';
import { Button, Collapse }   from 'react-bootstrap';
import KeyContent             from './KeyContent';

let keys = [
  {
    title: 'Comparison',
    classNameMod: 'comparison',
    description: 'Relates ideas on the basis of differences and similarities.',
    imagePath: '/media/keys/comparison.svg',
    keywords: ['different', 'in contrast', 'similarly', 'compared', 'however', 'the same as', 'on the other hand'],
    example: 'Comparing Killer whales and Blue whales on size, color, and life span.',
    signalingWords: 'instead; but; however; or; alternatively; whereas; on the other hand; while; compare; in comparison; in contrast; in opposition; not everyone; all but; have in common; similarities; share; resemble; the same as; just as; more than; longer than; less than; act like; look like; unlike; despite; although; just; options; difference; differentiate; different; (plus others you can find).',
    writingPattern: 'Sequence with a comparison signaling word contrasting the two ideas. The first idea is <span class="key-content__underscore"></span> (describes the topics for this idea). In contrast, the second idea is <span class="key-content__underscore"></span> (describes the topics for this idea).',
    mainIdeaPattern: '<h2><span class="key-content__underscore"></span> and <span class="key-content__underscore"></span> <span>(<em>two or more ideas</em>)</span> </h2><h2>were compared on <span class="key-content__underscore"></span>,</h2><h2> <span class="key-content__underscore"></span>, and <span class="key-content__underscore"></span>.</h2>'
  },
  {
    title: 'Problem & Solution',
    classNameMod: 'problem-solution',
    description: 'The main ideas are organized into two parts: a problem part and a solution part that responds to the problem by trying to eliminate it or a question part and an answer part that responds to the question by trying to answer it.',
    imagePath: '/media/keys/problem-and-solution.svg',
    keywords: ['problem', 'solution', 'trouble', 'question', 'response' ],
    example: 'Problem of 7 endangered whale species and solution of a whale sanctuary in Antarctic Ocean.',
    signalingWords: '<strong>Problem:</strong> <br/> problem, trouble, difficulty, hazard, need to prevent, threat, danger, puzzle, question (?), query, riddle, perplexity, enigma, issue, ...and more you can find... <br/><br/> <strong>Solution:</strong> <br/> to satisfy the problem, ways to reduce the problem, to solve these problems, protection from the problem, solution, response, answer, reply, comeback, recommendation, rejoinder, return, to set the issue at rest, suggestions',
    writingPattern: 'The problem is <span class="key-content__underscore"></span> [paragraph(s) includes a description of the problem and, if known, its cause(s)] <span class="key-content__underscore"></span>. <br/><br/> The solution is <span class="key-content__underscore"></span>[paragraph(s) include a description of the solution and how it gets rid of the cause(s) of the problem(s) or tries to] <span class="key-content__underscore"></span>.',
    mainIdeaPattern: '<h2>The problem is <span class="key-content__underscore"></span>,</h2><h2>and the solution is <span class="key-content__underscore"></span>.</h2>'
  },
  {
    title: 'Cause & Effect',
    classNameMod: 'cause-effect',
    description: 'Present causal or cause and effect-like relations between ideas.',
    imagePath: '/media/keys/cause-and-effect.svg',
    keywords: ['cause', 'effect', 'led to', 'accomplish', 'as a result' ],
    example: 'Inner ear damage can lead whales to beach themselves',
    signalingWords: 'cause, lead to, bring about, originate, produce, make possible, owing to, by means of, accomplish, by, since, due to, because, in order to, reasons, give reasons for, the reason why, if/then, this is why, on account of, in explanation, effect, affects, so, influenced by, as a result, result from, consequence, consequent, thus, therefore, accordingly, for the purpose of, … and more... ',
    writingPattern: 'The cause is <span class="key-content__underscore"></span> [paragraph(s) includes a description of the cause of the situation]<span class="key-content__underscore"></span>. <br/><br/> The effect is <span class="key-content__underscore"></span>[paragraph(s) includes a description of the effects of results]<span class="key-content__underscore"></span>.',
    mainIdeaPattern: '<h2>The cause is <span class="key-content__underscore"></span>,</h2><h2>and the effect is <span class="key-content__underscore"></span>.</h2>'
  },
  {
    title: 'Sequence',
    classNameMod: 'sequence',
    description: 'Ideas grouped by order in time (sometimes order of location).',
    imagePath: '/media/keys/sequence.svg',
    keywords: ['first', 'later', 'after that', 'finally', 'following' ],
    example: 'History of the Civil War, growth from birth to 12 years old, procedures in a recipe or manual',
    signalingWords: 'later, afterwards, afterward, after, after that, later on, then, subsequently, as time passed, following, continuing on, to end, finally, year(s) ago, at the start of first year...later that year, in the first place, in the second place, first and foremost, first, second, third, 1, 2, 3, 4, …, next, primarily, secondarily, early, before, to begin with, to start with, more recently, again, finally, until, additionally, the former, the latter, not long after, soon, now, today, after a short while, meanwhile, immediately, last, steps, stages, time line, history, sequence, development... and more – plus look for a series of dates for histories.',
    writingPattern: 'First, <span class="key-content__underscore"></span>[paragraph(s) state what happened first in the sequence]... <br/> Second,<span class="key-content__underscore"></span>[paragraph(s) saying what happened second in the sequence]... <br/> Third, <span class="key-content__underscore"></span>(what happened next, etc.)',
    mainIdeaPattern: 'The main idea is a sequence of steps, procedure, or history presented. <br/><br/>Growth stages of humpback whale: (1st) nursing calf, (2nd) leaving mom, (3rd) jumping high, and (4th) reaching adult size.'
  },
  {
    title: 'Description',
    classNameMod: 'description',
    description: 'Gives specific information about a person, place, or thing. Sets a scene. The main idea is the thing discussed and its major details.',
    imagePath: '/media/keys/description.svg',
    keywords: ['characteristics are', 'for example', 'for instance', 'qualities are', 'such as' ],
    example: 'Describing the size, color and life span of Killer whales',
    signalingWords: 'attributes of; characteristics are; for example; for instance; in describing; marks of; namely; properties of; qualities are; specifically; such as; that is; this particular; which was;... (plus others you can find). <br/><br/>Other signals include words that would help you picture a scene. For example, the author might use colors.',
    writingPattern: 'The first thing we know is... (describe the first attribute/information about a topic)... <br/> The second thing we know is that... (describe the second attribute of a topic).... <br/> The third thing is... (describe the third attribute of a topic)...',
    mainIdeaPattern: '<span class="key-content__underscore"></span> (topic) has/have <span class="key-content__underscore"></span> (1, 2, 3 or more) important characteristic(s). <br/> The first is <span class="key-content__underscore"></span>; <br/> The second is <span class="key-content__underscore"></span>; <br/> The third is<span class="key-content__underscore"></span> ; '
  }
];

export default class Key extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentKey: keys[0]
    };
  }


  // NOTE: Using the lesson's structure ID as an index...
  componentDidMount(){
    const { lesson } = this.props;
    this.setState({
      currentKey: keys[lesson.structure.id-1]
    });
  }

  componentWillReceiveProps(nextProps) {
    const { lesson } = nextProps;
    this.setState({
      currentKey: keys[lesson.structure.id-1]
    });
  }

  render() {
    let chooserClass = `key-chooser ${this.state.keyChooserOpen ? 'key-chooser--open' : 'key-chooser--closed'}`;
    let keyChooserKeys = keys.map((key, i) => {
      return (
        <div key={i} className="key-chooser__option">
          <a href="javascript:void(0)" onClick={(e) => this.handleKeyChooserClick(i)}>
            <img src={key.imagePath}/>
            <span>{key.title}</span>
          </a>
        </div>
      );
    }, this);

    return (
      <div>
        <KeyContent keyItem={this.state.currentKey} />
        <div className={chooserClass} onClick={() => this.setState({ keyChooserOpen: !this.state.keyChooserOpen })}>
          <span className="key-chooser__desc">See all keys...</span>
          <Button className="key-chooser__toggle">
          </Button>
          <Collapse in={this.state.keyChooserOpen} timeout={0}>
            <div className="key-chooser__body">
              {keyChooserKeys}
            </div>
          </Collapse>
        </div>
      </div>
    );
  }

  handleKeyChooserClick(index){
    this.setState({ currentKey: keys[index] });
  }
}