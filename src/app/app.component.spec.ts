import { render } from '@testing-library/angular';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('should render the router outlet', async () => {
    const { container } = await render(AppComponent);
    expect(container.querySelector('router-outlet')).toBeInTheDocument();
  });

  it('should create the app', async () => {
    const { fixture } = await render(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
