'use strict';

exports.view = function(req, res) {
    // Node types:
    // - me: the user looking at the graph
    // - user: other users (that have a full user account)
    // - confirmed: people that entered an activity link code at least once
    // - maybe: the me user created an activity with this as of yet unknown user
    // - dummy: nodes that only serve as an interaction start point to connect to a new person
    var nodes = [
        {'name':'Toby',type:'me',fixed:true,'x':200,'y':200},
        {'name':'Napoleon',type:'user','x':119.78326114385005,'y':148.22850053702265},
        {'name':'Mlle.Baptistine',type:'user','x':283.2197661979198,'y':152.48437541679215},
        {'name':'Mme.Magloire',type:'user','x':197.7630629784904,'y':101.41523185234183},
        {'name':'CountessdeLo',type:'confirmed','x':191.54113627196566,'y':294.70720539890306},
        {'name':'Geborand',type:'confirmed','x':221.13070279965143,'y':111.61755372650349},
        {'name':'Champtercier',type:'maybe','x':245.5830846788855,'y':284.4369294209353},
        {'name':'Cravatte',type:'maybe','x':139.47134838008878,'y':275.645677639671},
        {'name':'Count',type:'dummy','x':104.40919498292496,'y':186.4110967275147},
        {'name':'OldMan',type:'dummy','x':282.14112729654136,'y':249.58047216074291}
    ];

    var links = [
        {'source':1,'target':0,'numActivities':1},
        {'source':2,'target':0,'numActivities':8},
        {'source':3,'target':0,'numActivities':10},
        {'source':3,'target':2,'numActivities':6},
        {'source':4,'target':0,'numActivities':1},
        {'source':5,'target':0,'numActivities':1},
        {'source':6,'target':0,'numActivities':1},
        {'source':7,'target':0,'numActivities':1},
        {'source':8,'target':0,'numActivities':2},
        {'source':9,'target':0,'numActivities':1},
        {'source':3,'target':1,'numActivities':1},
        {'source':5,'target':1,'numActivities':1},
        {'source':9,'target':4,'numActivities':1},
        {'source':2,'target':3,'numActivities':1},
        {'source':9,'target':2,'numActivities':1},
        {'source':7,'target':8,'numActivities':1}
    ];

    res.send({
        nodes: nodes,
        links: links
    });
};

exports.update = function(req, res){
    res.send({ status: 'OK' });
};
