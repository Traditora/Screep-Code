/**
 * roleBuilder: A creep that builds construction sites.
 * - It will prioritize scavenging from tombstones before doing other tasks.
 * - It will only withdraw energy from containers or storage.
 */
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // --- HIGH-PRIORITY: Scavenge Tombstones ---
        // If the creep has free capacity, check for nearby tombstones with energy.
        if (creep.store.getFreeCapacity() > 0) {
            const tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                filter: (t) => t.store.getUsedCapacity(RESOURCE_ENERGY) > 0
            });

            // If a tombstone is found, override all other logic to go get it.
            if (tombstone) {
                if (creep.withdraw(tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(tombstone, { visualizePathStyle: { stroke: '#ff0000' } });
                }
                return; // Exit after handling the tombstone
            }
        }

        // --- Normal State Switching & Action Logic ---
        if (creep.memory.building && creep.store.getUsedCapacity() == 0) {
            creep.memory.building = false;
            creep.say('🔄 withdraw');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            const buildTarget = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (buildTarget) {
                if (creep.build(buildTarget) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(buildTarget, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // When idle, move to range 1 of position (28,31)
                const idlePos = new RoomPosition(28, 31, creep.room.name);
                if (creep.pos.getRangeTo(idlePos) > 1) {
                    creep.say('🔄 idle');
                    creep.moveTo(idlePos, { visualizePathStyle: { stroke: '#a805fc' }, range: 1 });
                }
            }
        } else {
            const energySource = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                                  s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
            });

            if (energySource) {
                if (creep.withdraw(energySource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(energySource, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            } else {
                creep.say('...idle');
            }
        }
    }
};

module.exports = roleBuilder;
