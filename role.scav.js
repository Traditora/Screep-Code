/**
 * rolescav: A creep that scavenges for dropped resources, tombstones, and ruins.
 * - Prioritizes tombstones, then ruins, then dropped energy.
 * - If no resources are found, it moves to a designated idle point at (22, 17).
 * - Deposits collected energy into storage, containers, spawns, or extensions.
 */
var rolescav = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // --- Secondary: Move energy from link to container if available ---
        if (rolescav.linkToContainer(creep)) {
            return;
        }

        // --- State Machine ---
        // If collecting and now full, switch to depositing.
        if (creep.memory.collecting && creep.store.getFreeCapacity() == 0) {
            creep.memory.collecting = false;
            creep.say('📦 deposit');
        }
        // If depositing and now empty, switch to collecting.
        if (!creep.memory.collecting && creep.store.getUsedCapacity() == 0) {
            creep.memory.collecting = true;
            creep.say('💀 scavenge');
        }

        // --- Action Logic ---
        if (creep.memory.collecting) {
            // 1. Tombstones
            let target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                filter: t => t.store.getUsedCapacity(RESOURCE_ENERGY) > 0
            });
            // 2. Ruins
            if (!target) {
                target = creep.pos.findClosestByPath(FIND_RUINS, {
                    filter: r => r.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                });
            }
            // 3. Dropped energy
            if (!target) {
                const dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                    filter: r => r.resourceType == RESOURCE_ENERGY && r.amount > 0
                });
                if (dropped) {
                    if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(dropped, { visualizePathStyle: { stroke: '#ffff00' } });
                    }
                    return;
                }
            }
            
            // Withdraw from tombstone or ruin
            if (target) {
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            } else {
                // --- MODIFIED: If no targets, move to idle point ---
                const idlePoint = new RoomPosition(22, 17, creep.room.name);
                if (creep.pos.getRangeTo(idlePoint) > 0) {
                    creep.say('-> idle');
                    creep.moveTo(idlePoint, { visualizePathStyle: { stroke: '#cc00cc' } });
                } else {
                    creep.say('idle');
                }

                // If idle but still has energy, switch to deposit
                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                    creep.memory.collecting = false;
                    creep.say('📦 deposit');
                }
            }
        } else {
            // Deposit to storage, container, spawn, or extension
            const depositTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s =>
                    ((s.structureType == STRUCTURE_STORAGE ||
                      s.structureType == STRUCTURE_CONTAINER ||
                      s.structureType == STRUCTURE_SPAWN ||
                      s.structureType == STRUCTURE_EXTENSION) &&
                     s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            });
            if (depositTarget) {
                if (creep.transfer(depositTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(depositTarget, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                creep.say('no deposit');
            }
        }
    },

    // --- Secondary function: Move energy from link to container ---
    linkToContainer: function(creep) {
        const link = Game.getObjectById('688a609d889231db34f9795f');
        const container = Game.getObjectById('688a25d22211de0c59dce788');
        if (
            link &&
            link.store[RESOURCE_ENERGY] > 0 &&
            creep.store.getUsedCapacity() == 0 &&
            container &&
            container.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        ) {
            // Withdraw from link
            if (creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(link, { visualizePathStyle: { stroke: '#00ff00' } });
            } else {
                // After withdrawing, deposit into the container
                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
            return true;
        }
        return false;
    }
};

module.exports = rolescav;
