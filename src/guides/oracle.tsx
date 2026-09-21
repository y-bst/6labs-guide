// Guide 03 · Oracle: one question from the home screen to an exported answer.
import { BOOYAH, HISTORY, PLACEHOLDERS } from '../data/intel';
import { Bullets, GuideLink, NextButton, RecapFlow, Term, TextLink } from '../shell/content';
import { defineGuide } from '../shell/guide';
import { Layer } from '../shell/scenes';
import { Icon } from '../ui/Icon';
import { IntelScreen, PageHead, ScreenBar } from '../ui/intel/app';
import { AddMenu, AskBox, HomeLauncher, Query, SourceMenu, SuggestedPrompts } from '../ui/intel/ask';
import { AnswerCard, Conversation, ExportButton, ExportMenu, FollowUpBox, QuestionBubble, ThinkingSteps } from '../ui/intel/chat';
import { IntelMap } from '../ui/intel/IntelMap';
import { Click } from '../ui/Click';

function BooyahAnswer() {
  return (
    <>
      <p>412 booyah finishes across the last 7 days (top 3.1% of matches played).</p>
      <p><b>What the winners share</b></p>
      <ul>
        <li>78% landed outside the top three hot drops and rotated in on the second circle</li>
        <li>Median 4.2 revives given per squad — nearly double the non-winning average</li>
        <li>81% held a mid-range weapon plus one utility slot, not two rifles</li>
      </ul>
      <p><b>Where they win it</b></p>
      <ul>
        <li>Final circle held from high ground in 64% of finishes</li>
        <li>Average final-zone engagement lasts 38 seconds — winners open first in 7 of 10</li>
      </ul>
      <p><b>Bottom line:</b> booyah correlates far more with rotation discipline than with early kill count.</p>
    </>
  );
}

function Screen() {
  return (
    <IntelScreen sidebar={{
      active: { newQuery: 'home', oracle: 'oracle..ask' },
      highlight: { agents: 'home', history: 'history' },
      history: [{ text: BOOYAH.question, show: 'thinking..', active: 'thinking..' }, ...HISTORY.slice(1)],
    }}>
      <Layer show="home" className="i-pg">
        <HomeLauncher switchHl="home" />
      </Layer>

      <Layer show="oracle..ask" className="i-pg">
        <PageHead page="oracle" />
        <AskBox controls={{ plus: 'add', source: 'source', send: 'ask' }} send="ask" click="ask" menus={<><SourceMenu show="source" /><AddMenu show="add" /></>}>
          <Query show="oracle..add">{PLACEHOLDERS.oracle}</Query>
          <Query show="ask" typed>{BOOYAH.question}</Query>
        </AskBox>
        <SuggestedPrompts hl="oracle" />
      </Layer>

      <Layer show="thinking..">
        <ScreenBar title={BOOYAH.question}><Click on="export"><ExportButton hl="export" /></Click></ScreenBar>
        <Conversation scrollDown="more">
          <QuestionBubble>{BOOYAH.question}</QuestionBubble>
          <ThinkingSteps steps={BOOYAH.steps} show="thinking..radiologist" play="thinking..radiologist" focus={{ steps: [3, 4], during: 'radiologist' }} />
          <AnswerCard show="answer.." sources={BOOYAH.sources} credits={BOOYAH.credits} related={BOOYAH.related} highlight={{ sources: 'answer', footer: 'footer', related: 'more' }}>
            <BooyahAnswer />
          </AnswerCard>
        </Conversation>
        <FollowUpBox hl="more" />
        <ExportMenu show="export" />
      </Layer>
    </IntelScreen>
  );
}

export default defineGuide({
  slug: 'oracle',
  icons: true,
  hero: <Icon name="oracle" size={36} />,
  lede: <>Oracle is the 6labs agent you ask about your game in plain words: who wins, where players get stuck, what they buy. It shows how it worked out each answer and backs it with the gameplay videos it used. This guide follows one question from start to finish.</>,
  glance: {
    title: 'Intelligence at a glance',
    note: <>This guide covers the highlighted part. <GuideLink to="radiologist">Radiologist</GuideLink> and <GuideLink to="context">context</GuideLink> have their own guides.</>,
    map: <IntelMap highlight="oracle" />,
  },

  steps: [
    { id: 'home', label: 'Home' },
    { id: 'oracle', label: 'Open Oracle' },
    { id: 'data', label: 'Pick the data' },
    { id: 'ask', label: 'Ask' },
    { id: 'think', label: 'Oracle works' },
    { id: 'answer', label: 'The answer' },
    { id: 'more', label: 'Keep asking' },
    { id: 'export', label: 'Export' },
    { id: 'history', label: 'History' },
  ],

  scenes: [
    {
      id: 'home', step: 'home',
      title: 'Every agent starts from one box',
      body: <>
        <p>The home screen (<b>New Query</b> in the sidebar) asks what you want to know. The switch above the box picks the agent:</p>
        <Bullets items={[
          <><b>Oracle</b>: answers questions about players and matches</>,
          <><b>Radiologist</b>: finds exact moments in gameplay videos</>,
        ]} />
        <p>The same agents are in the sidebar under <b>Core agents</b>. Home is just a quicker way in. <b>Forecaster</b> is coming soon.</p>
      </>,
    },
    {
      id: 'oracle', step: 'oracle',
      title: 'Oracle answers questions about your players',
      body: <>
        <p>Open <b>Oracle</b> from the sidebar. It's built for questions about player behaviour across many sessions and <Term def="A group of players who share something, like everyone who joined this week or everyone who won a match.">cohorts</Term>.</p>
        <p>Not sure what to ask? Tap one of the <b>suggested prompts</b> under the box.</p>
      </>,
    },
    {
      id: 'source', step: 'data', focus: [490, 330, 1.2],
      title: 'Choose where the answer comes from',
      body: <>
        <p>The button under the box picks the data Oracle looks at:</p>
        <Bullets items={[
          <><b>BlueStacks</b>: gameplay from the BlueStacks app player</>,
          <><b>YouTube</b>: gameplay videos posted on YouTube</>,
          <><b>SDK – PC</b> and <b>SDK – Mobile</b>: sessions from the 6labs SDK in your game</>,
          <><b>Library</b>: the videos in your Gameplay Library</>,
        ]} />
      </>,
    },
    {
      id: 'add', step: 'data', focus: [490, 330, 1.2],
      title: 'Add a file or a connected tool',
      body: <>
        <p>The <b>+</b> button adds more for this question:</p>
        <Bullets items={[
          <><b>Attach PDF</b>: a design doc or plan for Oracle to read along</>,
          <><b>Connectors</b>: data from a tool your company has connected, like BigQuery</>,
        ]} />
        <TextLink to="context">How documents and connectors work →</TextLink>
      </>,
    },
    {
      id: 'ask', step: 'ask',
      title: 'Ask in plain words',
      body: <>
        <p>Type the question and press the arrow. No filters, no query language.</p>
        <p>This example asks: <b>“Show me players who got <Term def="Free Fire's word for winning a match: the last player or squad standing.">booyah</Term>”</b>.</p>
      </>,
    },
    {
      id: 'thinking', step: 'think',
      title: 'It shows its work as it goes',
      body: <>
        <p>While it works, Oracle lists each step and how long it took. In short, it:</p>
        <Bullets items={[
          <>works out what you're asking, and checks earlier messages in this conversation</>,
          <>plans how to answer, then finds the matching gameplay</>,
          <>writes the insights and <b>checks them against the source data</b> before showing them</>,
        ]} />
      </>,
    },
    {
      id: 'radiologist', step: 'think', focus: [712, 400, 1.2],
      title: 'It asks Radiologist for the evidence',
      body: <>
        <p>To find the right gameplay, Oracle consults <b>Radiologist</b>, the agent that reads videos moment by moment.</p>
        <p>Here it scanned 13,290 matches, found the 412 booyah finishes, and compared them with the matches that didn't win. The answer is built from that comparison.</p>
        <TextLink to="radiologist">How Radiologist works →</TextLink>
      </>,
    },
    {
      id: 'answer', step: 'answer',
      title: 'An answer you can check',
      body: <Bullets items={[
        <><b>Sources</b>: the videos Oracle used. Open them to watch, or see them in the Gameplay Library.</>,
        <><b>The answer</b>: the headline number first, then what stands out, then a <b>bottom line</b>.</>,
      ]} />,
    },
    {
      id: 'footer', step: 'answer', focus: [712, 575, 1.35],
      title: 'Copy it, rate it',
      body: <>
        <p>Under every answer:</p>
        <Bullets items={[
          <><b>Copy</b>: paste the answer anywhere</>,
          <><b>Credits used</b>: what this answer cost (20 here)</>,
          <><b>Thumbs up or down</b>: tells 6labs whether the answer helped</>,
        ]} />
      </>,
    },
    {
      id: 'more', step: 'more',
      title: 'Follow up in the same conversation',
      body: <>
        <p><b>Related</b> suggests the next questions. Tap one to ask it.</p>
        <p>Or type your own in the box at the bottom. Oracle remembers the conversation, so a short follow-up like <b>“now only squads”</b> works.</p>
      </>,
    },
    {
      id: 'export', step: 'export',
      title: 'Take the answer to a meeting',
      body: <>
        <p><b>Export</b>, top right, turns the conversation into:</p>
        <Bullets items={[
          <><b>PDF</b>: every question and answer in the conversation</>,
          <><b>Image</b>: the analysis as an infographic</>,
          <><b>PPT</b>: slides ready for a meeting</>,
        ]} />
      </>,
    },
    {
      id: 'history', step: 'history', focus: [150, 620, 1.3],
      title: 'Every conversation is saved',
      body: <>
        <p>Questions appear under <b>History</b> in the sidebar. Click one to reopen it with its answers and keep going.</p>
        <p><b>New Query</b> starts a fresh conversation.</p>
        <NextButton to="radiologist" />
      </>,
    },
  ],

  Screen,

  recap: {
    title: 'Ask in plain words. Get answers backed by gameplay.',
    head: <RecapFlow items={[['Home', 'Sidebar'], 'Pick the data', 'Ask', { strong: 'Oracle + Radiologist' }, ['Answer + videos', 'Follow up', 'Export']]} />,
    quotes: [
      "Ask about your players the way you'd ask an analyst. No dashboards, no SQL.",
      'Every answer shows the gameplay videos behind it.',
      'Turn an answer into a PDF, an infographic or slides in one click.',
    ],
    faqs: [
      ['What can we ask Oracle?', 'Questions about how players behave across many sessions and groups of players: who wins, where they struggle, what they buy, how they move through the game.'],
      ['Where does the data come from?', "From the source picked under the box: BlueStacks, YouTube, the 6labs SDK (PC or mobile) or the studio's Gameplay Library. Connected tools like BigQuery can add the studio's own data."],
      ['How do we know the answer is right?', 'Oracle lists every step it took, shows the videos it used, and checks the answer against the source data before showing it.'],
      ['Does each question cost something?', 'Each answer uses credits. The number shows under the answer.'],
      ['How is Oracle different from Radiologist?', 'Radiologist finds and shows exact moments in gameplay. Oracle answers questions across many sessions, and asks Radiologist for the evidence.'],
      ["What's Forecaster?", "A third agent that's coming soon. It shows in the sidebar but can't be opened yet."],
    ],
    next: { to: 'radiologist', kicker: 'Next guide', text: 'Radiologist — find the exact moment' },
  },
});
