/**
 * roleHaul: A creep that moves energy from central storage to other structures.
 * - Withdraws energy from containers in priority order, then storage.
 * - Deposits energy into spawns, extensions, and towers that need it.
 * - If all structures are full, it will move to an idle rally point.
 */
var roleHaul = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // --- STATE MACHINE ---
        // If the creep is hauling and becomes empty, switch to withdrawing.
        if (creep.memory.hauling && creep.store.getUsedCapacity() == 0) {
            creep.memory.hauling = false;
            creep.say('🔄 withdraw');
        }
        // If the creep is withdrawing and becomes full, switch to hauling.
        if (!creep.memory.hauling && creep.store.getFreeCapacity() == 0) {
            creep.memory.hauling = true;
            creep.say('🚚 haul');
        }

        // --- ACTION LOGIC ---
        if (creep.memory.hauling) {
            // Find the closest structure that needs energy.
            // Priority: Spawns and Extensions first, then Towers.
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) &&
                           s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            // If no spawns or extensions need energy, check towers.
            if (!target) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => {
                        return s.structureType == STRUCTURE_TOWER &&
                               s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
            }
            
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // If nothing needs energy, move to the idle point.
                const idlePoint = new RoomPosition(27, 13, creep.room.name);
                if (creep.pos.getRangeTo(idlePoint) > 0) {
                    creep.say('-> idle');
                    creep.moveTo(idlePoint, { visualizePathStyle: { stroke: '#cc00cc' } });
                } else {
                    creep.say('...idle');
                }
            }
        } else {
            // Withdraw from containers in priority order, then storage
            let energySource = null;
            const containers = [
                Game.getObjectById('688a25d22211de0c59dce788'),
                Game.getObjectById('688a3a815d82914a6bac7f0b'),
                Game.getObjectById('688a36c84ee3e64fb9f3cde8')
            ];
            for (const container of containers) {
                if (container && container.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                    energySource = container;
                    break;
                }
            }
            // If no container, try storage
            if (!energySource) {
                energySource = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_STORAGE &&
                        s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                });
            }
            if (energySource) {
                if (creep.withdraw(energySource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energySource, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }
    }
};

module.exports = roleHaul;
