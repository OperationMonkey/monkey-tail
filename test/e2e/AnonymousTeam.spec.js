'use strict';

var h = require('../helpers_');

h.describe('Logged in as npc', {user: 'npc@example.com'}, function() {
    it('can create a new location', function() {
        h.runAsync(function(done) {
            h.request('POST', h.baseURL + 'location')
                .send({
                    name: 'Tingelkringel',
                    lat: 46,
                    lng: 7,
                    type: 'gastronomy'
                })
                .end(function(res) {
                    expect(res.statusCode).toBe(200);

                    var loc = res.body;
                    expect(loc.name, 'TingelKringel', 'correct name');
                    expect(typeof loc.points.npc).toBe('undefined', 'no points for npc team');
                    expect(loc.points.team1).toBe(0, 'no points for team1');
                    expect(loc.points.team2).toBe(0, 'no points for team2');
                    expect(loc.points.team3).toBe(0, 'no points for team3');
                    expect(loc.points.team4).toBe(0, 'no points for team4');
                    expect(loc.points.team5).toBe(0, 'no points for team5');
                    expect(loc.team).toBe('npc', 'location belongs to npc');
                    done();
                })
            ;
        });
    });
});

h.describe('Npc viewed from player team member', function() {
    it('cannot get the details of a member of the npc team', function() {
        h.runAsync(function(done) {
            // Try to get npc@example.com
            h.request('GET', h.baseURL + 'person/000000000000000000000010')
                .end(function(res) {
                    expect(res.statusCode).toBe(404, 'npc not found');
                    expect(typeof res.body.error).toBe('string', 'got an error message');
                    done();
                })
            ;
        });
    });
});
