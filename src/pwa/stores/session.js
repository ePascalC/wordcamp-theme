import { types, getParent, resolveIdentifier } from 'mobx-state-tree';
import Speaker from './speaker';
import Track from './track';

// Hours -- correction - move this to database
const hoursOffset = -2;

const Id = types.union(types.number, types.string);

const SpeakerReference = types.reference(types.late(() => Speaker), {
  get: (id, parent) => resolveIdentifier(Speaker, parent, id) || null,
  set: speaker => speaker.id || speaker,
});

const TrackReference = types.reference(types.late(() => Track), {
  get: (id, parent) => resolveIdentifier(Track, parent, id) || null,
  set: track => track.id || track,
});

const Session = types
  .model('Session')
  .props({
    id: types.identifier(Id),
    type: types.optional(types.string, 'wcb_session'),
    sessionTitle: types.maybe(types.string),
    sessionTimestamp: types.maybe(types.number),
    isFavorite: types.optional(types.boolean, false),
    speakers: types.optional(types.array(SpeakerReference), []),
    tracks: types.optional(types.array(TrackReference), []),
  })
  .views(self => {
    const getConnection = () => getParent(self, 3).connection;
    const date = new Date();

    return {
      get entity() {
        return getConnection().entity(self.type, self.id);
      },
      get title() {
        return self.sessionTitle || self.entity.title;
      },
      get link() {
        return self.entity.link;
      },
      get timestamp() {
        const { _wcpt_session_time: time } = self.entity.meta;
        // seconds to milliseconds
        return self.sessionTimestamp || (time + hoursOffset * 3600) * 1000;
      },
      get date() {
        date.setTime(self.timestamp);
        return date;
      },
      get startTime() {
        const hours = self.date.getHours().toString();
        const minutes = self.date.getMinutes().toString();
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      },
      get endTime() {
        const { nextSessions } = self;
        return nextSessions.length
          ? nextSessions.sort((a, b) => a.timestamp - b.timestamp)[0].startTime
          : null;
      },
      get nextSessions() {
        return self.tracks.map(t => t.sessions[t.sessions.indexOf(self) + 1]).filter(s => !!s);
      },
    };
  })
  .actions(self => ({
    toggleFavorite() {
      self.isFavorite = !self.isFavorite;
    },
    afterCreate() {
      self.speakers.forEach(speaker => speaker && speaker.addSession(self));
      self.tracks.forEach(track => track && track.addSession(self));
    },
  }));

export default Session;
