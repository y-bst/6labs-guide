// Guide 03 · Oracle: one question from the home screen to an exported answer.
import { BOOYAH, HISTORY, PLACEHOLDERS } from '../data/intel';
import { Bullets, GuideLink, NextButton, RecapFlow, Term, TextLink } from '../shell/content';
import { defineGuide } from '../shell/guide';
import { Layer } from '../shell/scenes';
import { Icon } from '../ui/Icon';
import { IntelScreen, PageHead, ScreenBar } from '../ui/intel/app';
import { AddMenu, AskBox, HomeLauncher, Query, SourceMenu, SuggestedPrompts } from '../ui/intel/ask';
import { AnswerCard, AnswerNote, AnswerSection, AnswerTable, Cites, Conversation, ExportButton, ExportMenu, FollowUpBox, QuestionBubble, ThinkingSteps, VideoAnalysisCta } from '../ui/intel/chat';
import { IntelMap } from '../ui/intel/IntelMap';
import { Click } from '../ui/Click';

/** The answer as Oracle writes it: what happened, what it means, what to do about it. */
function BooyahAnswer() {
  return (
    <>
      <AnswerSection n="01" kicker="What happened">
        <em>412</em> booyah finishes in the last 7 days — the top <em>3.1%</em> of matches played.
      </AnswerSection>
      <p>All figures cover ranked squad matches that reached the final circle, compared with the matches that placed but did not win.</p>
      <h4>What separates a win from a top-5 finish?</h4>
      <AnswerTable
        head={['Outcome', 'Matches', 'Landed off hot drop', 'Revives per squad', 'Held high ground']}
        rows={[
          ['Booyah', '412', '78.0%', '4.2', '64.0%'],
          ['Top 5, no win', '1,908', '41.3%', '2.3', '22.1%'],
        ]}
        footnote="% of matches in which the squad landed outside the three busiest drops, and held high ground entering the final circle. Counted per match."
      />
      <AnswerNote kind="insight" title="Rotation discipline predicts a win better than early kills">
        Winning squads land away from the crowd in 78% of finishes and rotate in on the second circle. Early kill count is almost flat between the two groups.
      </AnswerNote>
      <AnswerNote kind="fact" title="Winners carry one utility slot, not a second rifle">
        81% of booyah squads held a mid-range weapon plus one utility item. The figure is 46% among squads that placed without winning.
      </AnswerNote>
      <AnswerSection n="02" kicker="What to do next" tone="green">
        The numbers say <em>where</em> squads win it. The sessions can show <em>how</em> they play the final circle.
      </AnswerSection>
      <p>Two of the findings above — the rotation gap and the utility-slot split — need the footage to settle. The numbers show what squads carried, not how they used it.</p>
    </>
  );
}

/** What the video analysis comes back with: patterns, each backed by the clips it came from. */
function BooyahVideo() {
  return (
    <>
      <h4>Pattern A · Winners open the final fight first</h4>
      <p>In 7 of 10 final circles, the winning squad initiates rather than holding. The average final-zone engagement lasts 38 seconds <Cites ids={[12, 41, 67]} />, and the squad that opens takes the high ground before the last rotation <Cites ids={[86, 94]} />.</p>
      <h4>Pattern B · The second circle is where the gap opens</h4>
      <p>Squads that land off the hot drop spend the second circle moving, not looting <Cites ids={[5, 24]} />. Squads that placed without winning are still contesting their landing zone at the same point <Cites ids={[17, 55, 69]} />.</p>
      <h4>Pattern C · Revives happen mid-rotation, not mid-fight</h4>
      <p>Winning squads revive while moving between circles <Cites ids={[7, 12, 19]} />. The losing pattern is a revive attempted inside an active fight, which costs a second player <Cites ids={[56, 70, 95]} />.</p>
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
          <AnswerCard
            show="answer.."
            meta={[['BlueStacks sessions'], ['your data warehouse — not connected'], ['players', '2,365'], ['matches', '13,290']]}
            note={<>No BI connection found, so Oracle answered from BlueStacks gameplay. Some figures may not cover your whole player base. <b>Connect your BI source</b> to re-run this on your own data.</>}
            highlight={{ meta: 'answer', next: 'footer' }}
          >
            <BooyahAnswer />
            <VideoAnalysisCta hl="footer" click="footer" />
          </AnswerCard>
          <AnswerCard show="more..">
            <BooyahVideo />
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
      body: <>
        <p>The answer opens with what it had to work with — which sessions, how many players, and whether your own data warehouse was connected.</p>
        <Bullets items={[
          <><b>01 What happened</b>: the headline figure first</>,
          <><b>The table</b>: the numbers behind it, so you can check the claim</>,
          <><b>Insight</b> and <b>Fact</b>: what the numbers mean, and what they simply say</>,
        ]} />
      </>,
    },
    {
      id: 'footer', step: 'answer', focus: [712, 560, 1.3],
      title: 'Then watch the sessions',
      body: <>
        <p>The numbers say <b>where</b> something happens. To see <b>why</b>, Oracle offers to run a <b>video analysis</b> over the matching gameplay.</p>
        <p>That is the second half of an answer, and it is a separate step because it reads the footage rather than the figures.</p>
      </>,
    },
    {
      id: 'more', step: 'more',
      title: 'What the footage adds',
      body: <>
        <p>The video analysis comes back as <b>patterns</b>, each one backed by the clips it came from — the numbered chips open those sessions.</p>
        <p>Keep going in the box at the bottom. Oracle remembers the conversation, so a short follow-up like <b>“now only squads”</b> works.</p>
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
