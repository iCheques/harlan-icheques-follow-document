import { timelineGenerator } from '../libs/timeline-generator';

const reportShow = (props) => {
  if ($('#baterapido-timeline .timeline').length) $('#baterapido-timeline .timeline').remove();
  if (props.reports === undefined) return;
  const timeline = harlan.call('timeline');
  timelineGenerator(timeline, props.reports);
  $('#baterapido-timeline').append(timeline.element());
};

export default reportShow;
