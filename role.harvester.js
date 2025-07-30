/**
 * roleHarvester: A creep that harvests energy and deposits it into a specific storage.
 * - Harvests from the first available source.
 * - When full, it will deposit all energy into the storage with ID '688a25d22211de0c59dce788'.
 */
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // --- STATE MACHINE ---
        // If the creep is harvesting and becomes full, switch to depositing.
        if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.say('📦 deposit');
        }
        // If the creep is depositing and becomes empty, switch back to harvesting.
        if (!creep.memory.harvesting && creep.store.getUsedCapacity() == 0) {
            creep.memory.harvesting = true;
            creep.say('⛏️ harvest');
        }


        // --- ACTION LOGIC ---
        // If the creep's state is 'harvesting'
        if (creep.memory.harvesting) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                // Use travelTo if you have it, otherwise moveTo
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        // If the creep's state is 'depositing'
        else {
            // --- MODIFIED: Target specific storage by ID ---
            const storageTarget = Game.getObjectById('688a25d22211de0c59dce788');
            
            if (storageTarget) {
                if (creep.transfer(storageTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storageTarget, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            // If the storage doesn't exist for some reason, the creep will do nothing.
        }
    }
};

module.exports = roleHarvester;
