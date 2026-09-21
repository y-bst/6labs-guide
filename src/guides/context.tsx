// Guide 05 · Documents & Connectors: what agents know about your game.
// Connectors are an overview on purpose (no setup steps): what's connected, who sees it, who can edit.
import { FILES, PLACEHOLDERS } from '../data/intel';
import { Bullets, Facts, GuideLink, NextButton, RecapFlow, Term } from '../shell/content';
import { defineGuide } from '../shell/guide';
import { Layer, Show } from '../shell/scenes';
import { Icon } from '../ui/Icon';
import { IntelScreen, PageHead, Tile } from '../ui/intel/app';
import { AddMenu, AskBox, Query, SuggestedPrompts } from '../ui/intel/ask';
import { BrandMark } from '../ui/intel/brands';
import { BoxTitle, ConceptBox, ConceptScene, Lines } from '../ui/intel/concept';
import { ConnectionDetail, ConnectorsPage, Status } from '../ui/intel/connectors';
import { AddFilesBar, DropZone, FileItem, FileListHeading } from '../ui/intel/documents';
import { IntelMap } from '../ui/intel/IntelMap';

const [GDD, ECONOMY, STORYBOARD] = FILES;

function Screen() {
  return (
    <IntelScreen sidebar={{
      active: { oracle: 'use', documents: 'drop..saved', connectors: 'connectors..describe-data' },
      highlight: { context: 'why' },
    }}>
      {/* what context is */}
      <ConceptScene show="why" animate>
        <Lines>
          <path className="flow" d="M245 396C245 490 468 470 468 556" stroke="#00A393" />
          <path className="flow" d="M691 396C691 490 468 470 468 556" stroke="#8F5CFF" />
        </Lines>
        <ConceptBox className="why-d">
          <BoxTitle page="uploads">Documents</BoxTitle>
          <p>Files you upload: what your game is meant to be.</p>
          <div className="k-list">
            <span><Icon name="file" size={16} style={{ color: '#D6336C' }} />Game design docs</span>
            <span><Icon name="file" size={16} style={{ color: '#D6336C' }} />Live-ops plans</span>
            <span><Icon name="sheet" size={16} style={{ color: 'var(--green)' }} />Balance logs</span>
            <span><Icon name="img" size={16} style={{ color: 'var(--violet)' }} />Storyboards and research</span>
          </div>
        </ConceptBox>
        <ConceptBox className="why-c">
          <BoxTitle page="connectors">Connectors</BoxTitle>
          <p>Live links to your tools: what your data says.</p>
          <div className="k-list">
            <span><BrandMark brand="bigquery" size={16} />BigQuery</span>
            <span><BrandMark brand="snowflake" size={16} />Snowflake</span>
            <span><BrandMark brand="slack" size={16} />Slack</span>
            <span><BrandMark brand="jira" size={16} />Jira, and more</span>
          </div>
        </ConceptBox>
        <ConceptBox className="why-a">
          <b>Both agents use it when they answer</b>
          <span className="agentpill"><Tile page="oracle" size="md" iconSize={18} style={{ width: '32px', height: '32px', borderRadius: '8px' }} />Oracle</span>
          <span className="agentpill"><Tile page="radiologist" size="md" iconSize={18} style={{ width: '32px', height: '32px', borderRadius: '8px' }} />Radiologist</span>
        </ConceptBox>
      </ConceptScene>

      {/* Documents */}
      <Layer show="drop..saved" className="i-pg">
        <PageHead page="uploads" />
        <Show when="drop"><DropZone hl="drop" /></Show>
        <Show when="uploading..saved">
          <AddFilesBar />
          <FileListHeading count={FILES.length} />
          <FileItem file={GDD} hl="describe" phases={[
            { show: 'uploading', status: 'uploading', bar: { w: '72%' } },
            { show: 'describe', status: 'uploaded' },
            { show: 'saved', status: 'saved' },
          ]} />
          <FileItem file={ECONOMY} phases={[
            { show: 'uploading', status: 'uploading', bar: { w: '45%', delay: '.2s' } },
            { show: 'describe', status: 'uploading', bar: { w: '88%', duration: '.1s' } },
            { show: 'saved', status: 'saved' },
          ]} />
          <FileItem file={STORYBOARD} phases={[
            { show: 'uploading..describe', status: 'uploading', bar: { w: '58%', delay: '.4s' } },
            { show: 'saved', status: 'saved' },
          ]} />
        </Show>
      </Layer>

      {/* Connectors */}
      <ConnectorsPage show="connectors..kinds" activeHl="connectors" kindDuring="kinds" />

      <Layer show="shared, describe-data">
        <ConnectionDetail
          health={[{ health: 'ready', show: 'shared' }, { health: 'need', show: 'describe-data' }]}
          ownerHl="shared" columns="describe-data" describeHl="describe-data" />
        <ConceptBox className="roles" show="shared">
            <div className="k-role"><i style={{ background: '#F2994A' }}>Y</i><div><b>Owner (you)</b><span>Connects, refreshes or disconnects. Decides whether teammates can edit.</span></div></div>
            <div className="k-role"><i style={{ background: '#5B5BD6' }}>A</i><div><b>Teammate, switch on</b><span>Sees <b>Shared · you can edit</b> and can add descriptions.</span></div></div>
            <div className="k-role"><i style={{ background: 'var(--ph)' }}>M</i><div><b>Teammate, switch off</b><span>Can see the connection, but can't edit it.</span></div></div>
        </ConceptBox>
      </Layer>

      <ConceptScene show="health" title="How a connection shows its health" titleTop={80}>
        <Lines>
          <path d="M298 212H328M321 205l7 7-7 7" stroke="#1770EF" />
          <path d="M603 212H633M626 205l7 7-7 7" stroke="#1770EF" />
          <path d="M773 292V430" stroke="#C9392A" strokeDasharray="7 8" />
        </Lines>
        <ConceptBox className="hb" style={{ left: '32px' }}><Status health="sync" /><p>6labs is importing the tables. Descriptions unlock when it's done.</p></ConceptBox>
        <ConceptBox className="hb" style={{ left: '337px' }}><Status health="need" /><p>Usable already. A few table or column descriptions are missing.</p></ConceptBox>
        <ConceptBox className="hb" style={{ left: '642px' }}><Status health="ready" /><p>Connected and ready to query. Oracle answers from it.</p></ConceptBox>
        <div style={{ position: 'absolute', left: '786px', top: '352px', font: '600 12.5px/1.3 var(--display)', color: 'var(--red)' }}>if access is removed</div>
        <ConceptBox className="h-err"><Status health="err" /><p>Shows the reason, like a removed permission. Fix it in the tool, then click <b>Reconnect</b>.</p></ConceptBox>
        <ConceptBox className="h-note"><p><b>While there's an error</b>, Oracle stops using that connection until someone reconnects it.</p></ConceptBox>
      </ConceptScene>

      {/* back in Oracle */}
      <Layer show="use" className="i-pg">
        <PageHead page="oracle" />
        <AskBox controls={{ plus: true }} menus={<AddMenu />}>
          <Query>{PLACEHOLDERS.oracle}</Query>
        </AskBox>
        <SuggestedPrompts />
      </Layer>
    </IntelScreen>
  );
}

export default defineGuide({
  slug: 'context',
  pageTitle: 'Documents and Connectors Guide',
  storyLabel: 'Documents and Connectors walkthrough',
  icons: true,
  hero: <Icon name="docs" size={36} />,
  lede: <>Agents understand gameplay. <b>Context</b> tells them about your game: the design docs and plans your team wrote (Documents), and the data your tools already hold (Connectors). This guide shows how both work.</>,
  glance: {
    title: 'Intelligence at a glance',
    note: <>This guide covers the highlighted part. <GuideLink to="oracle">Oracle</GuideLink> and <GuideLink to="radiologist">Radiologist</GuideLink> have their own guides.</>,
    map: <IntelMap highlight="context" />,
  },

  steps: [
    { id: 'why', label: 'Why context' },
    { id: 'docs', label: 'Documents' },
    { id: 'conn', label: 'Connectors' },
    { id: 'use', label: 'Use it' },
  ],

  scenes: [
    {
      id: 'why', step: 'why',
      title: 'Tell the agents about your game',
      body: <>
        <p>Agents already understand gameplay. <b>Context</b> in the sidebar gives them what only your studio knows:</p>
        <Bullets items={[
          <><b>Documents</b>: files you upload, like design docs and live-ops plans</>,
          <><b>Connectors</b>: live links to tools your company already uses, like BigQuery or Slack</>,
        ]} />
        <p>Oracle and Radiologist both use this context when they answer.</p>
      </>,
    },
    {
      id: 'drop', step: 'docs',
      title: 'Drop in your files',
      body: <>
        <p>Open <b>Documents</b> and drop files onto the page, or click to browse.</p>
        <p>Anything that gives deeper context works: design docs, live-ops plans, player research, balance logs, strategy docs.</p>
        <Facts items={['PDF · DOC · CSV · TXT · images', 'Up to 30 MB each']} />
      </>,
    },
    {
      id: 'uploading', step: 'docs',
      title: 'Files upload side by side',
      body: <>
        <p>Each file shows its progress while it uploads.</p>
        <p>Keep adding more from the bar at the top, or delete any file with the bin.</p>
      </>,
    },
    {
      id: 'describe', step: 'docs', focus: [712, 330, 1.2],
      title: 'Tell agents what each file is for',
      body: <>
        <p>Once a file is up, 6labs asks: <b>What should agents know about this file?</b></p>
        <p>A line or two on its purpose and key topics is what makes the file useful to agents. <b>Save</b> it, or <b>Skip</b> for now.</p>
      </>,
    },
    {
      id: 'saved', step: 'docs',
      title: 'Ready for every agent',
      body: <>
        <p>Saved files show their description under the name. Edit it any time with the pencil.</p>
        <p>From now on, agents read these files when they answer.</p>
      </>,
    },
    {
      id: 'connectors', step: 'conn', chapter: 'Connectors · overview',
      title: 'Connectors link your other tools',
      body: <>
        <p><b>Connectors</b> are <Term title="Connector" def="A live link between 6labs and another tool. Connectors are MCP connections: MCP is a standard way for AI agents to plug into outside tools.">live links</Term> between 6labs and the tools your studio already uses.</p>
        <Bullets items={[
          <><b>Active in your company</b>: tools someone at your company has already connected, here BigQuery and Snowflake</>,
          <><b>Available to add</b>: tools ready to connect</>,
        ]} />
      </>,
    },
    {
      id: 'kinds', step: 'conn', chapter: 'Connectors · overview',
      title: 'Pull data in, push insights out',
      body: <Bullets items={[
        <><b>Pull in</b> (BigQuery, Snowflake, AppsFlyer, Facebook Ads): Oracle answers from your own numbers, like campaigns, revenue and retention</>,
        <><b>Push out</b> (Jira, Slack, Discord): findings become tickets, alerts and reports where your team already works</>,
      ]} />,
    },
    {
      id: 'shared', step: 'conn', chapter: 'Connectors · overview',
      title: 'Everyone sees it, the owner decides who edits',
      body: <>
        <Bullets items={[
          <>Everyone at your company can see an active connection and who connected it</>,
          <>The <b>owner</b> can let teammates edit its descriptions with one switch</>,
          <>With the switch on, teammates see <b>Shared · you can edit</b>. With it off, they can view but not edit.</>,
        ]} />
        <p>One tool can have several connections, like two BigQuery projects. Each one is a tab.</p>
      </>,
    },
    {
      id: 'health', step: 'conn', chapter: 'Connectors · overview',
      title: 'Each connection shows its health',
      body: <Bullets items={[
        <><b>Syncing</b>: 6labs is still importing the tables</>,
        <><b>Needs work</b>: already usable, but some descriptions are missing</>,
        <><b>Ready</b>: connected and ready to query</>,
        <><b>Error</b>: access was removed. Oracle stops using it until someone reconnects.</>,
      ]} />,
    },
    {
      id: 'describe-data', step: 'conn', chapter: 'Connectors · overview',
      title: 'Describe the data. It stays yours.',
      body: <>
        <p>Like documents, each table and column can carry a short description, so Oracle knows what the data means. The more are filled in, the sharper the answers.</p>
        <p>6labs only <b>reads</b> from your tools and never writes back. Descriptions live in 6labs, not in your warehouse.</p>
      </>,
    },
    {
      id: 'use', step: 'use', focus: [490, 330, 1.2],
      title: 'Add context to a single question',
      body: <>
        <p>In Oracle, the <b>+</b> button adds context to one question: <b>Attach PDF</b>, or pick a connected tool under <b>Connectors</b>.</p>
        <NextButton to="index.html">Back to all guides →</NextButton>
      </>,
    },
  ],

  Screen,

  recap: {
    title: 'Give agents your context once. Every answer gets sharper.',
    head: <RecapFlow items={[['Documents: upload + describe', 'Connectors: link + describe'], { strong: 'Oracle · Radiologist' }, 'Sharper answers']} />,
    quotes: [
      'Upload your design docs once and every agent uses them.',
      'Connect BigQuery or Snowflake and ask Oracle about your own numbers.',
      'Read-only: 6labs never changes your data.',
    ],
    faqs: [
      ['What files can we upload?', 'PDF, DOC, CSV, TXT and images, up to 30 MB each.'],
      ['Do we have to describe every file?', 'No, you can skip it. But a short description is what helps agents use a file well.'],
      ['Which tools can we connect?', 'The Connectors page lists BigQuery, Snowflake, AppsFlyer, Jira, Slack, Discord and Facebook Ads.'],
      ['Can 6labs change our data?', 'No. It only reads from your warehouse. Descriptions are stored in 6labs, not in your tools.'],
      ['Who can see a connection?', 'Everyone at your company. Each connection has an owner, who decides whether teammates can edit its descriptions.'],
      ['What if a connection breaks?', 'It shows Error with the reason, like a removed permission. Fix access in the tool and click Reconnect.'],
    ],
    next: { to: 'index.html', kicker: 'All guides', text: 'Back to 6labs Studio guides' },
  },
});
