export class CreateRouteDTO {
    name!: string;
    description: string | undefined;
    status?: boolean;
}

export class UpdateRouteDTO {
    name?: string;
    description?: string;
    status?: boolean;
}

export class AssignUsersToRouteDTO {
    userIds!: string[];
}