define(function() {
    var Guild = Class.extend({
        init: function(id, name) {
           this.members = [];//name
           this.id = id;
           this.name = name; 
        }/*, Maybe useful later… see #updateguild tag

        addMembers: function(membersList) {
			//maybe we could have tested the form of the array…
			this.members = _.union(this.members, membersList);
        },
        
        removeMembers: function(membersList) {
			this.members = _.difference(this.members, membersList);
		},
		
		listMembers: function(iterator) {
			return _.filter(this.members, iterator);
		}*/
    });

    return Guild;
});
