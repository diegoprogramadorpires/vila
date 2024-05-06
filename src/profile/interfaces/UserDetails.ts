export interface UserDetails {
    id: string;
    email: string;
    cpf: string;
    name: string;
    bio: string;
    profilePicture: string;
    contactInfo: {
        secondaryEmail?: string;
        phoneNumber?: string;
    };
}