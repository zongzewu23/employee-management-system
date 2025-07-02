// src/context/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import api from '../utils/api';
import {
    User,
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    ApiResponse,
    UserRole
} from '../types/api';

// ====================== State Type Definition ======================
interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// ====================== Action Type Definition ======================
type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
    | { type: 'LOGIN_FAILURE'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'SET_USER'; payload: User }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'CLEAR_ERROR' }
    | { type: 'SET_ERROR'; payload: string };

// ====================== Context Type Definition ======================
interface AuthContextType {
    // State
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Methods
    login: (credentials: LoginRequest) => Promise<boolean>;
    register: (userData: RegisterRequest) => Promise<boolean>;
    logout: () => void;
    getCurrentUser: () => Promise<void>;
    clearError: () => void;

    // Permission Check
    isAdmin: () => boolean;
    hasRole: (role: UserRole) => boolean;
}

// ====================== Initial State ======================
const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

// ====================== Reducer ======================
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };

        case 'LOGIN_FAILURE':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };

        case 'LOGOUT':
            return {
                ...initialState,
                isLoading: false,
            };

        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };

        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };

        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };

        default:
            return state;
    }
};

// ====================== Context Creation ======================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ====================== Provider Component ======================
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): React.JSX.Element => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // ====================== Login Method ======================
    const login = async (credentials: LoginRequest): Promise<boolean> => {
        try {
            dispatch({ type: 'LOGIN_START' });

            const response: ApiResponse<AuthResponse> = await api.post('/auth/login', credentials);

            if (response.success && response.data) {
                const { accessToken, refreshToken, username, email, role } = response.data;

                // Construct user object (based on information in AuthResponse)
                const user: User = {
                    id: 0, // No id in AuthResponse, will get it later via getCurrentUser
                    username,
                    email,
                    role: role as UserRole,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: { user, token: accessToken, refreshToken }
                });

                localStorage.setItem('token', accessToken);

                // Get full user info after successful login
                await getCurrentUser();

                return true;
            } else {
                dispatch({
                    type: 'LOGIN_FAILURE',
                    payload: response.message || 'Login failed'
                });
                return false;
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Network error, please try again later';

            dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
            return false;
        }
    };

    // ====================== Register Method ======================
    const register = async (userData: RegisterRequest): Promise<boolean> => {
        try {
            dispatch({ type: 'LOGIN_START' });

            const response: ApiResponse<any> = await api.post('/auth/register', userData);

            if (response.success) {
                // Automatically log in after successful registration
                const loginSuccess = await login({
                    username: userData.username,
                    password: userData.password,
                });
                return loginSuccess;
            } else {
                dispatch({
                    type: 'LOGIN_FAILURE',
                    payload: response.message || 'Registration failed'
                });
                return false;
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Registration failed, please try again later';

            dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
            return false;
        }
    };

    // ====================== Logout Method ======================
    const logout = () => {
        try {
            // Optional: call backend logout API
            api.post('/auth/logout').catch(() => {
                // Ignore logout API errors, because frontend logout should always succeed
            });
        } catch (error) {
            // Ignore errors
        } finally {
            dispatch({ type: 'LOGOUT' });
        }
    };

    // ====================== Get Current User Info ======================
    const getCurrentUser = async (): Promise<void> => {
        try {
            if (!state.token) {
                dispatch({ type: 'SET_LOADING', payload: false });
                return;
            }

            const response: ApiResponse<User> = await api.get('/auth/me');

            if (response.success && response.data) {
                dispatch({ type: 'SET_USER', payload: response.data });
            } else {
                // If getting user info fails, the token might have expired
                dispatch({ type: 'LOGOUT' });
            }
        } catch (error: any) {
            console.error('Failed to get user info:', error);

            // 401 error means invalid token, needs to log in again
            if (error.response?.status === 401) {
                dispatch({ type: 'LOGOUT' });
            } else {
                dispatch({
                    type: 'SET_ERROR',
                    payload: 'Failed to get user info'
                });
            }
        }
    };

    // ====================== Clear Error ======================
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    // ====================== Permission Check Methods ======================
    const isAdmin = (): boolean => {
        return state.user?.role === UserRole.ADMIN;
    };

    const hasRole = (role: UserRole): boolean => {
        return state.user?.role === role;
    };

    // ====================== Initialization Check ======================
    useEffect(() => {
        // Check for a valid authentication state when the app starts
        // Note: We use in-memory storage, so a page refresh requires re-login
        dispatch({ type: 'SET_LOADING', payload: false });
    }, []);

    // ====================== Update Axios header when Token changes ======================
    useEffect(() => {
        if (state.token) {
            // When the token exists, the axios interceptor will automatically add it to the request header
            // No need to set it manually here, it's already handled in api.ts
        }
    }, [state.token]);

    // ====================== Context Value ======================
    const contextValue: AuthContextType = {
        // State
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,

        // Methods
        login,
        register,
        logout,
        getCurrentUser,
        clearError,

        // Permission Check
        isAdmin,
        hasRole,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// ====================== Hook ======================
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

// ====================== Permission-protected HOC ======================
interface WithAuthProps {
    requireRole?: UserRole;
    fallback?: ReactNode;
}

export const withAuth = <P extends object>(
    Component: React.ComponentType<P>,
    options: WithAuthProps = {}
) => {
    const { requireRole, fallback = <div>Access denied</div> } = options;

    return (props: P): React.JSX.Element => {
        const { isAuthenticated, hasRole } = useAuth();

        if (!isAuthenticated) {
            return <div>Please log in to access this page</div>;
        }

        if (requireRole && !hasRole(requireRole)) {
            return <>{fallback}</>;
        }

        return <Component {...props} />;
    };
};

// ====================== Export ======================
export default AuthContext;