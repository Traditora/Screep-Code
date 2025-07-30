/**
 * rolefab: A dedicated repair creep.
 * * This is a focused version that only repairs structures.
 * * This creep will prioritize tasks in the following order:
 * 1. Repair the closest damaged structure (excluding walls).
 * 2. Move to an idle rally point if there is no work.
 * * When gathering energy, it will prioritize sources as follows:
 * 1. Containers or Storage with energy.
 * 2. Spawns (leaving a reserve for spawning).
 */
var rolefab = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // --- State Switching Logic ---
        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 withdraw');
        }
        if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
            creep.say('🔧 repair');
        }

        // --- Action Logic ---
        if (creep.memory.repairing) {
            // Priority 1: Find the closest damaged structure to repair.
            const repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
            });

            if (repairTarget) {
                if (creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(repairTarget, { visualizePathStyle: { stroke: '#b6ff00' } });
                }
            } else {
                // Priority 2: If there is no repair work, move to the idle point.
                const idlePoint = new RoomPosition(22, 18, creep.room.name);
                if (creep.pos.getRangeTo(idlePoint) > 0) {
                    creep.say('-> idle');
                    creep.travelTo(idlePoint, { visualizePathStyle: { stroke: '#cc00cc' } });
                } else {
                    creep.say('...idle');
                }
            }
        } else {
            // --- WITHDRAW LOGIC (Tombstones Removed) ---
            let energySource = null;

            // Priority 1: Find the closest container or storage with energy.
            const containerOrStorage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                                 s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
            });
            
            if (containerOrStorage) {
                energySource = containerOrStorage;
            } else {
                // Priority 2: As a last resort, withdraw from a spawn if it has sufficient energy.
                const spawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_SPAWN &&
                                 s.store.getUsedCapacity(RESOURCE_ENERGY) > 50 // Leave some for spawning
                });
                if (spawn) {
                    energySource = spawn;
                }
            }

            // If a valid energy source was found, move to it and withdraw.
            if (energySource) {
                if (creep.withdraw(energySource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(energySource, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            } else {
                // If no energy source is available anywhere, go idle at the same rally point.
                const idlePoint = new RoomPosition(23, 18, creep.room.name);
                if (creep.pos.getRangeTo(idlePoint) > 0) {
                    creep.say('-> idle');
                    creep.travelTo(idlePoint, { visualizePathStyle: { stroke: '#cc00cc' } });
                } else {
                    creep.say('...idle');
                }
            }
        }
    }
};

module.exports = rolefab;
