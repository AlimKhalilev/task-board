<template>
    <div class="reg">
        <div class="reg-container">
            <div class="reg-container-header">
                <h2>Регистрация</h2>
            </div>
            <form class="reg-container-form">
                <input type="text" name="login" placeholder="Логин">
                <input type="password" name="password" placeholder="Пароль">
                <hr>
                <input type="text" name="name" placeholder="Имя">
                <input type="text" name="surname" placeholder="Фамилия">
                <input type="email" name="mail" placeholder="Почта">
                <input type="submit" value="Регистрация">
            </form>
            <div class="reg-container-footer">
                <span>Уже есть аккаунт? <router-link to="/">Авторизация</router-link></span>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

    .reg {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        
        &-container {
            background-color: #042b3e;
            box-shadow: 0.625rem 0.625rem 0.3rem 0px rgba(0,0,0,0.4);
            min-width: 350px;
            text-align: center;

            &-header {
                padding: 1.5rem 2rem 1rem 2rem;
                background-color: #154e6b;

                h2 {
                    font-size: 1.6rem;
                    margin: 0;
                }
            }

            &-form {
                display: flex;
                flex-direction: column;
                padding: 1.5rem 2rem;

                hr {
                    margin: 0;
                    border: 0;
                    border-bottom: 1px solid #134e6b;
                    margin-top: 0.3rem;
                    margin-bottom: 1.5rem;
                }

                input {
                    outline: none;
                    font-size: 1rem;
                    font-weight: 500;
                    color: #fff;
                    background: transparent;
                    border: 1px solid #134e6b;
                    padding: 0.8rem 1rem;
                    transition: 0.3s ease-in-out;
                    font-family: 'Comfortaa', cursive;

                    &::placeholder {
                        color: rgb(166, 170, 189);
                    }

                    &[type="submit"] {
                        background-color: #154e6b;
                        padding: 0.8rem;
                        cursor: pointer;
                        box-shadow: 0.625rem 0.625rem 0.625rem -0.25rem #0f0f0f;
                        border: none;

                        &:hover {
                            transform: translate(-0.15rem, -0.15rem);
                            box-shadow: 1rem 1rem 0.625rem -0.35rem #0f0f0f;
                        }
                    }

                    &:not(:last-child) {
                        margin-bottom: 1.2rem;
                    }
                }
            }

            &-footer {
                margin-bottom: 1.5rem;

                span {
                    font-size: 0.9rem;

                    a {
                        color: #fff;
                    }
                }
            }
        }
    }

</style>

<script>
export default {
    beforeCreate() {
        document.title = "Регистрация - TaskBoard"
    }
}
</script>