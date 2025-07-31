var roleupt = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // State machine logic
        if (creep.memory.upgrading && creep.store.getUsedCapacity() == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 withdraw');
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            // If upgrading, move to the controller and upgrade it
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.travelTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } 
        else {
            // Only withdraw from the specified storage container
            const container = Game.getObjectById('688a53c490b4976fc919b719');
            if (container && container.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            } else {
                creep.say('⚠️ No Energy!');
            }
        }
    }
};

module.exports = roleupt;