var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // State machine: Set state to 'upgrading' or 'harvesting'
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        // If the creep's state is 'upgrading'
        if(creep.memory.upgrading) {
            // Deposit energy directly to the specified container
            const container = Game.getObjectById('688a479d99c22d1607ccd0a0');
            if (container && creep.store[RESOURCE_ENERGY] > 0) {
                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        // If the creep's state is 'harvesting'
        else {
            // Find the specific source at x=16, y=27
            var sources = creep.room.lookForAt(LOOK_SOURCES, 16, 27);
            
            // Check if a source was actually found at that position
            if (sources.length > 0) {
                var targetSource = sources[0]; // The first (and only) source at these coords
                
                // Try to harvest from the source, move to it if not in range
                if(creep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetSource, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                // Optional: What to do if no source is at 16, 27
                creep.say('⚠️ No Source!');
            }
        }
    }
};

module.exports = roleUpgrader;