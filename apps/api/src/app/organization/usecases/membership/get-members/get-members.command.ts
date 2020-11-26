import { CommandHelper } from '../../../../shared/commands/command.helper';
import { OrganizationCommand } from '../../../../shared/commands/organization.command';

export class GetMembersCommand extends OrganizationCommand {
  static create(data: GetMembersCommand) {
    return CommandHelper.create(GetMembersCommand, data);
  }
}
