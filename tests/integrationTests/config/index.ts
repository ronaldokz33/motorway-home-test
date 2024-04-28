const config = () => {
    const fileName = `${process.env.NODE_ENV || 'local'}.json`;
    return require(`./${fileName}`);
}

export default config;